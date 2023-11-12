import React from 'react'
import PropTypes from 'prop-types';

const Modals = ({
    buttonLabel, idModal, typeModal, children, className, disabled,
    btnSubmitText, btnCancelText, btnSubmitHandel, btnCancelHandel,
    buttonIcon, buttonSubmitIcon, btnSubmitDisabled,
}) => {
    return (
        <>
            <button
                type="button"
                className={`btn btn-${typeModal} ${className}`}
                data-toggle="modal"
                data-target={`#${idModal}`}
                disabled={disabled}
            >
                {
                    buttonIcon && (
                        <i className={buttonIcon} />
                    )
                }
                {buttonLabel}
            </button>

            <div className="modal fade" id={idModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button
                                type="button"
                                className="btn btn-default"
                                data-dismiss="modal"
                                onClick={btnCancelHandel}
                            >
                                {btnCancelText}
                            </button>
                            {
                                btnSubmitHandel && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={btnSubmitHandel}
                                        disabled={btnSubmitDisabled}
                                    >
                                        {
                                            buttonSubmitIcon && (
                                                <i className={buttonSubmitIcon} />
                                            )
                                        }
                                        {btnSubmitText}
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


Modals.propTypes = {
    buttonLabel: PropTypes.string,
    idModal: PropTypes.string,
    typeModal: PropTypes.string,
    children: PropTypes.node,
    btnSubmitText: PropTypes.string,
    btnCancelText: PropTypes.string,
    btnSubmitHandel: PropTypes.func,
    btnCancelHandel: PropTypes.func,
    buttonIcon: PropTypes.string,
    className: PropTypes.string,
    buttonSubmitIcon: PropTypes.string,
    btnSubmitDisabled: PropTypes.bool,
    disabled: PropTypes.bool,
};

Modals.defaultProps = {    
    buttonLabel: 'Default Modal',
    idModal: 'defaultModal',
    typeModal: 'default',
    children: 'One fine body...',
    btnSubmitText: 'Save changes',
    btnCancelText: 'Cancel',
    btnSubmitHandel: null,
    btnCancelHandel: () => {},
    buttonIcon: null,
    className: '',
    buttonSubmitIcon: null,
    btnSubmitDisabled: false,
    disabled: false,
};

export default Modals;
