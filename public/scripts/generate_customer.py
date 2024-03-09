from faker import Faker
import random

fake = Faker()

def generate_insert_query():
    insert_queries = []
    for _ in range(100):
        customer_name = fake.name().split()  
        first_name, last_name = customer_name[0], customer_name[-1]
        
        email_prefix = f'{last_name.lower()}_{first_name.lower()}'
        mobile_prefix = f'{random.randint(10000, 99999)}'
        
        insert_query = f"INSERT INTO CUSTOMERS (CUSTOMER_ID, CUSTOMER_NAME, EMAIL, MOBILE_NO) VALUES (CUSTOMER_ID_SEQ.NEXTVAL, '{' '.join(customer_name)}', '{email_prefix}@example.com', '9{mobile_prefix}1256');"
        insert_queries.append(insert_query)
    
    return insert_queries

if __name__ == "__main__":
    insert_queries = generate_insert_query()

  
    with open('output_queries.txt', 'w') as file:
        for query in insert_queries:
            file.write(query + '\n')

    print("Queries saved to 'output_queries.txt'")
