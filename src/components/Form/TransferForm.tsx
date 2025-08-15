import React, { useState, useEffect } from 'react';
import Input from "./parts/Input";
import Select from './parts/Select';
import Button from '../Button';
import s from './Form.module.scss';
import classNames from 'classnames';

const options = [
  { value: 'default', label: 'Выберите сотрудника', disabled: true },
  { value: 'user1', label: 'Надежда Садова' },
  { value: 'user2', label: 'Аскар Джумагулов' },
  { value: 'user3', label: 'Тимур Кульжабаев' },
  { value: 'user4', label: 'Амир Максутов' },
];

export default function TransferForm() {
  const [formData, setFormData] = useState({
    sum: '',
    employee: 'default',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.employee === 'default' || !formData.sum) return;

    localStorage.setItem('formData', JSON.stringify(formData));
    setFormData({ sum: '', employee: 'user1' });
  };

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__transfer)}>
      <Select
        name="employee"
        options={options}
        value={formData.employee}
        onChange={handleChange}
        required
      />
      <Input
        type="number"
        name="sum"
        value={formData.sum}
        onChange={handleChange}
        placeholder="Введите сумму"
        min="1"
        required
      />
      <div className={s.form__footer}>
        <Button type="submit" className={classNames(s.form__button, 'button button-orange')}>
          Передать
        </Button>
      </div>
    </form>
  );
}