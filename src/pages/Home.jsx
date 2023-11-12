import React, { Component } from 'react';

import Card from '../components/Card';
import Accordion from '../components/Accordion';
import Callouts from '../components/Callouts';

import ButonComponents from '../components/Button';

class Home extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <Callouts
            iconAlert="fas fa-envelope"
            title="Verifikasi Email !"
            closeAlert={false}
            type="warning"
          >
            <div
              className="d-flex flex-column align-items-start"
            >
              <div>
                <p className="mb-2">
                  Untuk menggunakan fitur chat, silakan verifikasi email Anda.
                </p>
                <p>
                  Jika email verifikasi tidak muncul, silakan klik tombol 
                  <b> Kirim Ulang </b>
                  di bawah ini.
                </p>
              </div>
              
              <ButonComponents
                type="button"
                buttonType="btn btn-primary"
                buttonAction={() => { console.log('kirim disini') }}
                buttonText="Kirim Ulang Email Verifikasi"
              />
            </div>
          </Callouts>
        </div>
        <div className="col-12">
          <Card
            title="FAQ - Frequently Asked Question"
          >
            <Accordion
              idAccordion="faqAccordion"
              data={
                [
                  {
                    title: 'FAQ Pertama',
                    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt, magna at elementum semper, turpis massa pellentesque ante, sed mattis leo quam at lectus. Vestibulum sed dictum est. Quisque placerat, elit ut fermentum lobortis, augue nulla mollis nibh, eleifend imperdiet mi ipsum ac dolor. Donec eget mi erat.',
                    show: true,
                    type: 'primary',
                  },
                  {
                    title: 'FAQ Kedua',
                    desc: 'Aenean sapien odio, varius et fermentum eu, consequat et magna. Quisque eget varius purus, nec porttitor urna. Vivamus scelerisque viverra tincidunt. Fusce commodo dui lectus, quis ornare odio egestas ac. Nullam euismod tellus in magna dignissim scelerisque. Etiam posuere nunc suscipit placerat luctus.',
                    show: false,
                    type: 'warning',
                  },
                  {
                    title: 'FAQ Ketiga',
                    desc: 'Aenean sapien odio, varius et fermentum eu, consequat et magna. Quisque eget varius purus, nec porttitor urna. Vivamus scelerisque viverra tincidunt. Fusce commodo dui lectus, quis ornare odio egestas ac. Nullam euismod tellus in magna dignissim scelerisque. Etiam posuere nunc suscipit placerat luctus.',
                    show: false,
                    type: 'primary',
                  },
                ]
              }
            />
          </Card>
        </div>
      </div>
    );
  }
}

export default Home;
