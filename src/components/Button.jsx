import React from 'react'

const ButonComponents = ({
    buttonType, buttonAction, buttonText, buttonIcon, style,
}) => {
    return (
        <div className={`btn ${buttonType}`} onClick={buttonAction} style={ style && (style) }>
            {
                buttonIcon && (
                    <i className={`${buttonIcon} mr-2`}></i>
                )
            }
            {buttonText}
        </div>
    )
}

export default ButonComponents
