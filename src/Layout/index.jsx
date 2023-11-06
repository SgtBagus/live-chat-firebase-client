import React from 'react';
import { HeaderComponents } from './components/Header';
import { FooterComponents } from './components/Footer';

export const LayoutDefault = ({ dataLogin, children, pageName }) => (
    <>
        <HeaderComponents dataLogin={dataLogin} />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container">
                        <div className="row mb-2">
                            <div className="col-sm-12">
                                <h1 className="m-0"> {pageName} </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="container">
                        {children}
                    </div>
                </div>
            </div>
        <FooterComponents />
    </>
)