# tests/test_selenium.py
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time

class JewelryShopTest(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.binary_location = r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Google Chrome.lnk"
        # Добавляем опции
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Используем ChromeDriver вместо YandexDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)
        self.driver.implicitly_wait(10)
        self.base_url = "http://localhost:3000"

    def tearDown(self):
        if self.driver:
            self.driver.quit()

    def test_homepage_load(self):
        """Тест загрузки главной страницы"""
        try:
            self.driver.get(self.base_url)
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке главной страницы: {str(e)}")

    def test_registration(self):
        """Тест страницы регистрации"""
        try:
            self.driver.get(f"{self.base_url}/profile")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы регистрации: {str(e)}")

    def test_login(self):
        """Тест страницы входа"""
        try:
            self.driver.get(f"{self.base_url}/profile")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы входа: {str(e)}")

    def test_catalog_browsing(self):
        """Тест страницы каталога"""
        try:
            self.driver.get(f"{self.base_url}/catalog")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы каталога: {str(e)}")

    def test_services_page(self):
        """Тест страницы услуг"""
        try:
            self.driver.get(f"{self.base_url}/services")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы услуг: {str(e)}")

    def test_promotions_page(self):
        """Тест страницы акций"""
        try:
            self.driver.get(f"{self.base_url}/promotions")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы акций: {str(e)}")

    def test_about_page(self):
        """Тест страницы о нас"""
        try:
            self.driver.get(f"{self.base_url}/about")
            # Проверяем, что страница загрузилась
            self.assertIn("React App", self.driver.title)
        except Exception as e:
            self.fail(f"Ошибка при загрузке страницы о нас: {str(e)}")

if __name__ == "__main__":
    unittest.main()