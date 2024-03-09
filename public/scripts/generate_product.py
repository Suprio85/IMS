import random

def generate_insert_queries():
    catagory_ids = 9
    product_ids = list(range(50065, 50071)) 
    brand_name = "Nova"

    insert_queries = []
    for product_id in product_ids:
        catagory_id = catagory_ids
        price = random.randint(20000, 40000)
        warranty_years = random.uniform(1, 5)
        image = 'something.jpeg'
        status = 'continued'
        random_alphabet = random.choice(['E27' ,'M8' , 'V27i' ,'P32'])
        product_name = f"{brand_name} {random_alphabet} {random.choice(['QHD','FHD','CURVED','UHD 4K' ,'UHD 8K'])} MONITOR"

        insert_query = (
            f"INSERT INTO PRODUCTS (PRODUCT_ID, PRODUCT_NAME, PRICE, WARRANTY_YEARS, IMAGE, STATUS, CATAGORY_ID) "
            f"VALUES ({product_id}, '{product_name}', {price:.2f}, {warranty_years:.2f}, '{image}', '{status}', {catagory_id});"
        )
        insert_queries.append(insert_query)

    return insert_queries

if __name__ == "__main__":
    product_insert_queries = generate_insert_queries()

    with open('product_insert_queries.sql', 'w') as file:
        for query in product_insert_queries:
            file.write(query + '\n')

    print("Product insert queries saved to 'product_insert_queries.sql'")
