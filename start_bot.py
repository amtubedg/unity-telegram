from aiogram import Bot, Dispatcher, types, Router
from aiogram.filters import Command
import asyncio

TOKEN = "a"
bot = Bot(token=TOKEN)
dp = Dispatcher()
router = Router()

# Обработчик команды /start
@router.message(Command("start"))
async def start_command(message: types.Message):
    user_id = message.from_user.id
    game_url = f"https://telegram-first-test.web.app/?userID={user_id}"
    
    # Создаем WebApp кнопку для моментального открытия игры
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [types.KeyboardButton(text="Играть", web_app=types.WebAppInfo(url=game_url))]
        ],
        resize_keyboard=True
    )

    await message.answer("Нажмите 'Играть', чтобы начать игру!", reply_markup=keyboard)

# Основная функция
async def main():
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
