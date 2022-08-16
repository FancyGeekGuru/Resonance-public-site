import { capitolize } from 'lib/utils/capitolize'
import styles from './Dropdown.styles'
import { ALL_FILTER } from '.'

export const Dropdown = ({ name, value, options, onChange, ...rest }) => (
  <label
    htmlFor={name}
    className="label bg-foreground text-background type-h3"
  >
    {value === ALL_FILTER ? capitolize(name) : value}
    <select
      name={name}
      value={value}
      {...rest}
      className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer whitespace-nowrap"
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={`${name}--${option}`} value={option}>
          {option === ALL_FILTER ? capitolize(option) : option}
        </option>
      ))}
    </select>
    <style jsx>{styles}</style>
  </label>
)
