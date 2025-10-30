import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

export const ordersApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<{ status: 'ok' }, { product_id: number | string; qty: number }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        responseHandler: 'text',
        validateStatus: (resp, raw) => {
          try {
            const parsed = raw ? JSON.parse(String(raw)) : null;
            return resp.ok && !(parsed as any)?.error;
          } catch {
            return resp.ok;
          }
        },
      }),
      transformResponse: (raw: string) => {
        if (!raw) return { status: 'ok' as const };
        try { return JSON.parse(raw); } catch { return { status: 'ok' as const }; }
      },
      async onQueryStarted({ product_id, qty }, { dispatch, queryFulfilled }) {
        const productId = String(product_id);
        const patches: { undo: () => void }[] = [];

        const p1 = dispatch(
          rootApi.util.updateQueryData('getProducts' as any, undefined, (draft: any[]) => {
            const item = draft?.find?.((x: any) => String(x.id) === productId);
            if (item && typeof item.stock === 'number') item.stock = Math.max(0, item.stock - qty);
          })
        );
        patches.push(p1);

        const p2 = dispatch(
          rootApi.util.updateQueryData('getProduct' as any, productId, (draft: any) => {
            if (draft && typeof draft.stock === 'number') draft.stock = Math.max(0, draft.stock - qty);
          })
        );
        patches.push(p2);

        try {
          await queryFulfilled;
          dispatch(rootApi.util.invalidateTags([
            { type: 'Products', id: 'LIST' },
            { type: 'Product',  id: productId },
            'Wallets',
            'Me',
          ] as any));
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ['Wallets', 'Me'],
    }),

    cancelOrder: builder.mutation<{ status: 'ok' }, { id: number | string }>({
      query: ({ id }) => ({
        url: `/orders/${id}/user-cancel`,
        method: 'PATCH',
        responseHandler: 'text',
        validateStatus: okIfNoError,
      }),
      transformResponse: (raw: string) => {
        if (!raw) return { status: 'ok' as const };
        try { return JSON.parse(raw); } catch { return { status: 'ok' as const }; }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;