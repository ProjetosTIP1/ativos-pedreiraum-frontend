import React from 'react';
import style from './TextField.module.css';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  fullWidth?: boolean;
  rows?: number;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  multiline = false,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const containerClasses = [
    style.container,
    fullWidth ? style.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={style.label}>
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          className={`${style.input} ${style.textarea}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={style.input}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className={style.errorText}>{error}</span>}
    </div>
  );
};
