import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Добро пожаловать в Crazy Diamond</h1>
        <h2>Найди свой стиль!</h2>
      </header>

      <section className="features">
        <div className="feature">
            <img src="/brl1brl1.png" alt="time" />
          <h3>Сделаем все в срок!</h3>
          <p>Делаем быстро и качественно, уложимся в кротчайшие сроки</p>
        </div>
        <div className="feature">
        <img src="/brl2brl2.png" alt="time" />
          <h3>Воплотим любую вашу фантазию!</h3>
          <p>Гравировки, моделирование, эскизы, консультации с ювелиром и дизайнером - все технологии в Вашем распоряжении</p>
        </div>
        <div className="feature">
        <img src="/brl3brl3.png" alt="time" />
          <h3>Бессконечная гарантия!</h3>
          <p>Наша гарантия - воплощение безграничного пространства, чем ближе вы к её концу, тем дольше её конец, вплоть до бесконечности</p>
        </div>
        <div className="feature">
        <img src="/brl4brl4.png" alt="time" />
          <h3>Уложимся в любой бюджет!</h3>
          <p>Уложимся в любой бюджет Можем использовать ваше сырьё, Подстроимся под любую цену, не потеряв качества</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>Изготовление ювелирных изделий на заказ в Санкт-Петербурге, требует высокой квалификации дизайнеров, ювелиров, надписи, прошлого образования и спецодеятельных компьютерных программ. Если все эти условия соблюдены и считается обязательным, то:</p>
        
      </footer>
    </div>
  );
};

export default Home;