import React from 'react'
import PropTypes from 'prop-types';

const Callouts = ({
    iconAlert, title, closeAlert, type, children,
}) => {
    return (
        <div className={`alert alert-${type} alert-dismissible`}>
            {
                closeAlert && (
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">
                        ×
                    </button>       
                )
            }
            <h5>
                <i className={`icon ${iconAlert}`} />
                {title}
            </h5>
            {children}
        </div>
    )
}


Callouts.propTypes = {
    iconAlert: PropTypes.string,
    title: PropTypes.string,
    closeAlert: PropTypes.bool,
    type: PropTypes.string,
    children: PropTypes.node,
};

Callouts.defaultProps = {
    iconAlert: 'fas fa-info',
    title: 'Alert',
    closeAlert: true,
    type: 'info',
    children: 'Info alert preview. This alert is dismissable',
};

export default Callouts;
