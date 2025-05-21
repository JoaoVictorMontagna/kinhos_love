from clickhouse_driver import Client


def get_clickhouse():
    return Client(
            host='uo6tv5ppoy.us-east-2.aws.clickhouse.cloud',
            user='default',
            password='k.XKM10YveR0i',
            secure=True
    )
