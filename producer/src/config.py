from environs import Env


def load_env_file():
    env = Env()
    # Read .env into os.environ
    env.read_env()
    return env


def get_config():
    env = load_env_file()
    return {
        "TWITTER": {
            "APP_KEY": env("APP_KEY"),
            "APP_SECRET": env("APP_SECRET"),
            "ACCESS_TOKEN": env("ACCESS_TOKEN"),
            "ACCESS_TOKEN_SECRET": env("ACCESS_TOKEN_SECRET")
        }
    }
