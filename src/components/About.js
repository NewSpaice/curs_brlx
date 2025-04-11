import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>О Нас</h1>
      
      <section className="about-section">
        <h2>Наша История</h2>
        <p>Crazy Diamond - это ювелирная мастерская, основанная в 2020 году. 
           Мы специализируемся на создании уникальных ювелирных изделий и предоставлении 
           высококачественных услуг по ремонту и обслуживанию украшений.</p>
      </section>

      <section className="team-section">
        <h2>Наша Команда</h2>
        <div className="team-grid">
          <div className="team-member">
            <img 
              src="/brlmast1.jpg" 
              alt="Фото Мастера Александр"
              className="team-member-photo" 
            />
            <h3>Александр</h3>
            <p>Главный ювелир</p>
          </div>
          <div className="team-member">
            <img 
              src="/brlmast2.jpg" 
              alt="Фото Мастера Елена"
              className="team-member-photo" 
            />
            <h3>Елена</h3>
            <p>Дизайнер украшений</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Контакты</h2>
        <div className="contact-info">
          <p><strong>Адрес:</strong> г. Санкт-Петербург, ул. Примерная, д. 123</p>
          <p><strong>Телефон:</strong> +7 (952) 812 52 52</p>
          <p><strong>Email:</strong> 52CrDi@yandex.ru</p>
          <p><strong>Время работы:</strong> 09:00 - 21:00</p>
        </div>
      </section>
    </div>
  );
};

export default About; 