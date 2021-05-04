import * as React from 'react';
import { AriaButtonProps } from '@react-types/button';
import { useButton } from '@react-aria/button';

type Variant = 'primary' | 'secondary' | 'lightPrimary' | 'lightSecondary';
type VariantRounded = 'rounded-none' | 'rounded' | 'rounded-full';
type VariantOutline = 'primary' | 'secondary' | 'light' | 'blue' | 'none';
type VariantBtnSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends AriaButtonProps<'button'> {
  id?: string;
  variant?: Variant;
  rounded?: VariantRounded;
  outline?: VariantOutline;
  size?: VariantBtnSize;
  endIcon?: React.ReactNode;
  endIconColor?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const classesByVariant: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-red-500 text-white',
  secondary: 'bg-blue-500 hover:bg-opacity-75 text-white',
  lightPrimary: 'bg-transparent hover:bg-gray-100 text-primary',
  lightSecondary: 'bg-transparent hover:bg-gray-100 text-blue-500',
};

const classesByVariantOutline: Record<VariantOutline, string> = {
  primary: 'border-2 border-primary',
  secondary: 'border-2 border-gray-500',
  light: 'border-2 border-white',
  blue: 'border-2 border-blue-500',
  none: '',
};
const classesByVariantBtnSize: Record<VariantBtnSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
};

/**
 * a simple button with four variants
 *
 * @param props
 * @returns
 */
export default function Button(props: ButtonProps) {
  const {
    id,
    variant = 'primary',
    rounded = 'rounded-full',
    size = 'sm',
    outline = 'none',
    disabled,
    className,
    endIcon,
    endIconColor = 'text-white',
    children,
    onClick,
    ...ariaProps
  } = props;
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ ...ariaProps, elementType: 'button' }, ref);

  return (
    <button
      id={id}
      className={`
      ${classesByVariant[variant]}
      ${classesByVariantOutline[outline]}
      ${classesByVariantBtnSize[size]}

      ${className}
      ${rounded}
      ${disabled ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}
      inline-flex items-center font-semibold	
      px-4 py-2 mx-1
      focus:outline-none focus:ring-3 focus:ring-offset-2 hover:bg-opacity-75 focus:ring-opacity-75`}
      disabled={disabled}
      onClick={onClick}
      type="button"
      ref={ref}
      {...buttonProps}
    >
      {children}
      {endIcon ? <span className={'pl-2 ' + endIconColor}>{endIcon}</span> : ''}
    </button>
  );
}
