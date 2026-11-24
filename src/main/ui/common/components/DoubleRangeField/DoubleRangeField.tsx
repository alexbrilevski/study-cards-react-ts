import { useState, type ChangeEvent, type FC } from 'react';
import s from './DoubleRangeField.module.css';

type DoubleRangeFieldProps = {
  value: [number, number];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChangeRange?: (value: [number, number]) => void;
};

const DoubleRangeField: FC<DoubleRangeFieldProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  onChangeRange,
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const [prevValue, setPrevValue] = useState(value);

  if (value[0] !== prevValue[0] || value[1] !== prevValue[1]) {
    setPrevValue(value);
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }

  const getPercent = (value: number) =>
    max === min ? 0 : Math.round(((value - min) / (max - min)) * 100);

  const setRangeFill = (minVal: number, maxVal: number) => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    return { left: `${minPercent}%`, width: `${maxPercent - minPercent}%` };
  };

  const onMinValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Math.min(+e.currentTarget.value, maxValue);
    if (value < min) {
      value = min;
    }
    setMinValue(value);
    onChangeRange?.([value, maxValue]);
  };

  const onMaxValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Math.max(+e.currentTarget.value, minValue);
    if (value > max) {
      value = max;
    }
    setMaxValue(value);
    onChangeRange?.([minValue, value]);
  };

  return (
    <div className={s['double-range-field']}>
      <input
        className={s['double-range-input']}
        type={'number'}
        value={minValue}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={'Minimum value'}
        onChange={onMinValueChange}
      />
      <div className={s['double-range']}>
        <div className={s['double-range-track']} />
        <div
          className={s['double-range-fill']}
          style={setRangeFill(minValue, maxValue)}
        />
        <input
          type={'range'}
          value={minValue}
          aria-label={'Minimum value'}
          onChange={onMinValueChange}
          className={s['double-range-thumb']}
          style={{ zIndex: minValue === maxValue && minValue !== 0 ? 1 : 0 }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        <input
          type={'range'}
          value={maxValue}
          aria-label={'Maximum value'}
          onChange={onMaxValueChange}
          className={s['double-range-thumb']}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
      <input
        className={s['double-range-input']}
        type={'number'}
        value={maxValue}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={'Maximum value'}
        onChange={onMaxValueChange}
      />
    </div>
  );
};

export default DoubleRangeField;
