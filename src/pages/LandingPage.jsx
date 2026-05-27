import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Zap, Globe, Shield, ChevronRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Code2 size={32} />,
      title: 'Умный редактор',
      description: 'Пишите код на русском языке, а наша система автоматически переведет его в полноценный код'
    },
    {
      icon: <Zap size={32} />,
      title: 'Быстрая компиляция',
      description: 'Мгновенная компиляция проектов для Pawno и других языков программирования'
    },
    {
      icon: <Globe size={32} />,
      title: 'Кроссплатформенность',
      description: 'Работайте с любого устройства - ПК, планшет или смартфон'
    },
    {
      icon: <Shield size={32} />,
      title: 'Безопасность',
      description: 'Ваши проекты хранятся локально в браузере и полностью защищены'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Coder-Pawno
        </div>
        <Link to="/editor">
          <button className="btn-primary">
            Начать работу
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '24px',
            padding: '8px 16px',
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="#667eea" />
            <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '500' }}>
              Революция в программировании 2026
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            <span style={{ color: 'white' }}>Кайфуйте от </span>
            <span className="gradient-text">программирования</span>
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Пишите на русском, а наша система переведет его на понятный язык программирования вместе с Coder-Pawno
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/editor">
              <button className="btn-primary" style={{
                fontSize: '18px',
                padding: '16px 32px'
              }}>
                Попробовать бесплатно
                <ChevronRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              </button>
            </Link>
            <a href="#features">
              <button className="btn-secondary" style={{
                fontSize: '18px',
                padding: '16px 32px'
              }}>
                Узнать больше
              </button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '100px 40px',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '60px',
              color: 'white'
            }}
          >
            Почему выбирают <span className="gradient-text">Coder-Pawno</span>?
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="premium-card"
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'white'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: 'white'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="premium-card"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'white'
          }}>
            Готовы начать?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '32px'
          }}>
            Присоединяйтесь к тысячам разработчиков уже сегодня
          </p>
          <Link to="/editor">
            <button className="btn-primary" style={{
              fontSize: '18px',
              padding: '16px 40px'
            }}>
              Запустить редактор
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        <p>&copy; 2026 Coder-Pawno. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
