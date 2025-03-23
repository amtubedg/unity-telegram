from aiogram import Bot, Dispatcher, types, Router
from aiogram.filters import Command
from dotenv import load_dotenv
import os
import asyncio

# Загружаем переменные из .env
load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
print("TOKEN:", TOKEN) 
bot = Bot(token=TOKEN)
dp = Dispatcher()
router = Router()

@router.message(Command("start"))
async def start_command(message: types.Message):
    user_id = message.from_user.id
    game_url = f"https://telegram-first-test.web.app/?userID={user_id}"

    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [types.KeyboardButton(text="Играть", web_app=types.WebAppInfo(url=game_url))]
        ],
        resize_keyboard=True
    )

    await message.answer("Нажмите 'Играть', чтобы начать игру!", reply_markup=keyboard)

async def main():
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
