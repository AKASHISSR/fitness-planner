import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

// Компонент настроек
function AdminSettingsTab() {
  const [settings, setSettings] = useState({
    siteName: 'FitGenius',
    siteDescription: 'Персональные планы питания и тренировок',
    contactEmail: 'support@fitgenius.ru',
    phoneNumber: '+375 29 897-52-19',
    socialLinks: {
      instagram: 'https://instagram.com/fitgenius',
      facebook: 'https://facebook.com/fitgenius',
      telegram: 'https://t.me/fitgenius'
    },
    seo: {
      metaTitle: 'FitGenius - Персональные планы питания и тренировок',
      metaDescription: 'Получите персональный план питания и тренировок, разработанный специально для вас. Достигайте своих целей с FitGenius!',
      keywords: 'питание, тренировки, фитнес, здоровье, персональный план'
    },
    appearance: {
      primaryColor: '#36b14e',
      secondaryColor: '#4fd165',
      fontFamily: 'Roboto, sans-serif',
      darkMode: false
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Загрузка настроек из Firestore
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
      
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      } else {
        // Если настройки не найдены, используем значения по умолчанию
        // и сохраняем их в Firestore
        await setDoc(doc(db, 'settings', 'site'), {
          ...settings,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error);
    }
    setIsLoading(false);
  };

  // Обработчик изменения настроек
  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  // Обработчик сохранения настроек
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        ...settings,
        updatedAt: Timestamp.now()
      });
      
      setSaveSuccess(true);
      
      // Сбрасываем сообщение об успешном сохранении через 3 секунды
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      setSaveError('Произошла ошибка при сохранении настроек. Пожалуйста, попробуйте еще раз.');
    }
    
    setIsSaving(false);
  };

  // Обработчик сброса настроек
  const handleReset = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки до значений по умолчанию?')) {
      setIsLoading(true);
      
      const defaultSettings = {
        siteName: 'FitGenius',
        siteDescription: 'Персональные планы питания и тренировок',
        contactEmail: 'support@fitgenius.ru',
        phoneNumber: '+375 29 897-52-19',
        socialLinks: {
          instagram: 'https://instagram.com/fitgenius',
          facebook: 'https://facebook.com/fitgenius',
          telegram: 'https://t.me/fitgenius'
        },
        seo: {
          metaTitle: 'FitGenius - Персональные планы питания и тренировок',
          metaDescription: 'Получите персональный план питания и тренировок, разработанный специально для вас. Достигайте своих целей с FitGenius!',
          keywords: 'питание, тренировки, фитнес, здоровье, персональный план'
        },
        appearance: {
          primaryColor: '#36b14e',
          secondaryColor: '#4fd165',
          fontFamily: 'Roboto, sans-serif',
          darkMode: false
        },
        updatedAt: Timestamp.now()
      };
      
      try {
        await setDoc(doc(db, 'settings', 'site'), defaultSettings);
        setSettings(defaultSettings);
        setSaveSuccess(true);
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Ошибка при сбросе настроек:', error);
        setSaveError('Произошла ошибка при сбросе настроек. Пожалуйста, попробуйте еще раз.');
      }
      
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="admin-loading">Загрузка настроек</div>;
  }

  return (
    <div>
      <h2><span className="icon">⚙️</span> Настройки сайта</h2>
      
      <div className="admin-settings-container">
        {/* Основные настройки */}
        <div className="admin-settings-section">
          <h3>Основные настройки</h3>
          
          <div className="admin-form-group">
            <label>Название сайта</label>
            <input 
              type="text" 
              value={settings.siteName}
              onChange={(e) => handleChange(null, 'siteName', e.target.value)}
            />
          </div>
          
          <div className="admin-form-group">
            <label>Описание сайта</label>
            <textarea 
              rows="3"
              value={settings.siteDescription}
              onChange={(e) => handleChange(null, 'siteDescription', e.target.value)}
            ></textarea>
          </div>
          
          <div className="admin-form-group">
            <label>Email для связи</label>
            <input 
              type="email" 
              value={settings.contactEmail}
              onChange={(e) => handleChange(null, 'contactEmail', e.target.value)}
            />
          </div>
          
          <div className="admin-form-group">
            <label>Номер телефона</label>
            <input 
              type="text" 
              value={settings.phoneNumber}
              onChange={(e) => handleChange(null, 'phoneNumber', e.target.value)}
            />
          </div>
        </div>
        
        {/* Социальные сети */}
        <div className="admin-settings-section">
          <h3>Социальные сети</h3>
          
          <div className="admin-form-group">
            <label>Instagram</label>
            <input 
              type="text" 
              value={settings.socialLinks.instagram}
              onChange={(e) => handleChange('socialLinks', 'instagram', e.target.value)}
            />
          </div>
          
          <div className="admin-form-group">
            <label>Facebook</label>
            <input 
              type="text" 
              value={settings.socialLinks.facebook}
              onChange={(e) => handleChange('socialLinks', 'facebook', e.target.value)}
            />
          </div>
          
          <div className="admin-form-group">
            <label>Telegram</label>
            <input 
              type="text" 
              value={settings.socialLinks.telegram}
              onChange={(e) => handleChange('socialLinks', 'telegram', e.target.value)}
            />
          </div>
        </div>
        
        {/* SEO настройки */}
        <div className="admin-settings-section">
          <h3>SEO настройки</h3>
          
          <div className="admin-form-group">
            <label>Meta Title</label>
            <input 
              type="text" 
              value={settings.seo.metaTitle}
              onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
            />
          </div>
          
          <div className="admin-form-group">
            <label>Meta Description</label>
            <textarea 
              rows="3"
              value={settings.seo.metaDescription}
              onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
            ></textarea>
          </div>
          
          <div className="admin-form-group">
            <label>Ключевые слова</label>
            <input 
              type="text" 
              value={settings.seo.keywords}
              onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
            />
            <small>Разделяйте ключевые слова запятыми</small>
          </div>
        </div>
        
        {/* Настройки внешнего вида */}
        <div className="admin-settings-section">
          <h3>Внешний вид</h3>
          
          <div className="admin-form-group">
            <label>Основной цвет</label>
            <div className="admin-color-picker">
              <input 
                type="color" 
                value={settings.appearance.primaryColor}
                onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
              />
              <input 
                type="text" 
                value={settings.appearance.primaryColor}
                onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label>Дополнительный цвет</label>
            <div className="admin-color-picker">
              <input 
                type="color" 
                value={settings.appearance.secondaryColor}
                onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
              />
              <input 
                type="text" 
                value={settings.appearance.secondaryColor}
                onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label>Шрифт</label>
            <select
              value={settings.appearance.fontFamily}
              onChange={(e) => handleChange('appearance', 'fontFamily', e.target.value)}
            >
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Lato, sans-serif">Lato</option>
              <option value="Poppins, sans-serif">Poppins</option>
            </select>
          </div>
          
          <div className="admin-form-group">
            <label className="admin-checkbox-label">
              <input 
                type="checkbox" 
                checked={settings.appearance.darkMode}
                onChange={(e) => handleChange('appearance', 'darkMode', e.target.checked)}
              />
              Темная тема по умолчанию
            </label>
          </div>
        </div>
      </div>
      
      {/* Сообщения о сохранении */}
      {saveSuccess && (
        <div className="admin-success-message">
          Настройки успешно сохранены!
        </div>
      )}
      
      {saveError && (
        <div className="admin-error-message">
          {saveError}
        </div>
      )}
      
      {/* Кнопки действий */}
      <div className="admin-form-actions">
        <button 
          className="admin-btn admin-btn-secondary"
          onClick={handleReset}
          disabled={isSaving}
        >
          Сбросить настройки
        </button>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
        </button>
      </div>
    </div>
  );
}

export default AdminSettingsTab;
