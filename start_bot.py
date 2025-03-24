from aiogram import Bot, Dispatcher, types, Router
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

bot = Bot(token=TOKEN)
dp = Dispatcher()
router = Router()

# Обработчик команды /start
@router.message(Command("start"))
async def start_command(message: types.Message):
    user_id = message.from_user.id
    game_url = f"https://telegramproject.vercel.app/?userID={user_id}"

    # Inline кнопка для запуска WebApp
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Играть", web_app=types.WebAppInfo(url=game_url))]
        ]
    )

    await message.answer("Нажмите 'Играть', чтобы начать игру!", reply_markup=keyboard)

# Основная функция
async def main():
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
