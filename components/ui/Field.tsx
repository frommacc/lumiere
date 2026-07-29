import { Input } from './input'
import { Label } from './label'

export default function Field({
  id,
  label,
  name,
  defaultValue,
  type = 'text',
  required = true,
}: {
  id: string
  label: string
  name: string
  defaultValue?: string | number
  type?: string
  required?: boolean
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  )
}
