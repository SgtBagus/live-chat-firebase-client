import React from 'react'

const ButonComponents = ({
    buttonType, buttonAction, buttonText, buttonIcon, style, disabled, type,
}) => {
    return (
        <button
            type={type}
            className={`btn ${buttonType}`}
            onClick={buttonAction}
            style={style && (style)}
            disabled={disabled}
        >
            {
                buttonIcon && (
                    <i className={`${buttonIcon} mr-2`}></i>
                )
            }
            {buttonText}
        </button>
    )
}

export default ButonComponents
