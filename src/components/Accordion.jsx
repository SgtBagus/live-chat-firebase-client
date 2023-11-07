import React from 'react'

const Accordion = ({
    idAccordion, data,
}) => {
    return (
        <div id={idAccordion}>
            {        
                data.map(({ title, desc, show, type }, idx) => {
                    const keyCollapse = `collapse-${idx}`;

                    return (
                        <div className={`card card-${type}`} key={keyCollapse} >
                            <div className="card-header">
                                <h4 className="card-title w-100">
                                    <a className="d-block w-100" data-toggle="collapse" href={`#${keyCollapse}`}>
                                        {title}
                                    </a>
                                </h4>
                            </div>
                            <div id={keyCollapse} className={`collapse ${show && 'show'}`} data-parent={`#${idAccordion}`}>
                                <div className="card-body">
                                    {desc}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Accordion;
