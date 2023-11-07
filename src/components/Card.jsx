import React from 'react'

const Card = ({
    children, title,
}) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">
                    {title}
                </h3>
            </div>
              <div className="card-body">
                {children}
            </div>
        </div>
    )
}

export default Card;
