# tests/test_selenium.py
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

class JewelryShopTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
        self.base_url = "http://localhost:3000"  # URL вашего React-приложения

    def tearDown(self):
        self.driver.quit()

    def test_homepage_load(self):
        """Тест загрузки главной страницы"""
        self.driver.get(self.base_url)
        self.assertIn("Jewelry Shop", self.driver.title)

    def test_registration(self):
        """Тест регистрации нового пользователя"""
        self.driver.get(f"{self.base_url}/register")
        
        # Заполняем форму регистрации
        email_input = self.driver.find_element(By.NAME, "email")
        password_input = self.driver.find_element(By.NAME, "password")
        confirm_password_input = self.driver.find_element(By.NAME, "confirmPassword")

        email_input.send_keys("test@example.com")
        password_input.send_keys("testpassword123")
        confirm_password_input.send_keys("testpassword123")

        # Отправляем форму
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Проверяем, что мы перенаправлены на страницу входа
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be(f"{self.base_url}/login")
        )

    def test_login(self):
        """Тест входа в систему"""
        self.driver.get(f"{self.base_url}/login")

        # Заполняем форму входа
        email_input = self.driver.find_element(By.NAME, "email")
        password_input = self.driver.find_element(By.NAME, "password")

        email_input.send_keys("test@example.com")
        password_input.send_keys("testpassword123")

        # Отправляем форму
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Проверяем, что мы вошли в систему (перенаправлены на профиль)
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be(f"{self.base_url}/profile")
        )

    def test_catalog_browsing(self):
        """Тест просмотра каталога"""
        self.driver.get(f"{self.base_url}/catalog")

        # Проверяем наличие элементов каталога
        products = self.driver.find_elements(By.CLASS_NAME, "product-card")
        self.assertGreater(len(products), 0)

    def test_services_page(self):
        """Тест страницы услуг"""
        self.driver.get(f"{self.base_url}/services")

        # Проверяем наличие списка услуг
        services = self.driver.find_elements(By.CLASS_NAME, "service-card")
        self.assertGreater(len(services), 0)

    def test_promotions_page(self):
        """Тест страницы акций"""
        self.driver.get(f"{self.base_url}/promotions")

        # Проверяем наличие акций
        promotions = self.driver.find_elements(By.CLASS_NAME, "promotion-card")
        self.assertGreater(len(promotions), 0)

    def test_about_page(self):
        """Тест страницы о нас"""
        self.driver.get(f"{self.base_url}/about")

        # Проверяем наличие информации о компании
        about_content = self.driver.find_element(By.CLASS_NAME, "about-content")
        self.assertTrue(about_content.is_displayed())

if __name__ == "__main__":
    unittest.main()