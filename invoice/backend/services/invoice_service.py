from models.models import Invoice, InvoiceItem , Items, Customer
from datetime import datetime
from fastapi import HTTPException, status
import traceback
from services.pdf_generator import generate_invoice_pdf

def create_invoice_service(db, data, bussiness_id):

    # print("----------- ONE DETAIL -------------")
    # print(db.query(Items).all())
    
    try:
        # -------- Check customer by phone ------
        customer = db.query(Customer).filter(
            Customer.phone == data.customer_phone).first()
        # print("------ Customer -------")
        # print(customer)


        # ------ Continue invoice logic ----------
        total_amount = 0
        tax_amount = 0
        invoice_items_data = []

        for item in data.items:
            
            # print("item_id:", item.item_id)
            # print("business_id:", bussiness_id)

            db_item = db.query(Items).filter(
                Items.id == item.item_id,
                Items.bussiness_id == bussiness_id).first()

            # print("------- db items --------")
            # print(db_item)

            if not db_item:
                raise HTTPException(
                    status_code = status.HTTP_404_NOT_FOUND,
                    detail = "Item Not Found"
                )
            
            if db_item.stock < item.quantity:
                raise HTTPException(
                    status_code = status.HTTP_404_NOT_FOUND,
                    detail = "Item Out of Stock"
                )
            
            # print("------ After the item Check --------")

            item_total = db_item.price * item.quantity 
            gst = (item_total * db_item.gst_rate) / 100 

            total_amount += item_total  
            tax_amount += gst 

            db_item.stock -= item.quantity
            db.commit()
            

            invoice_items_data.append({
                "item_id": db_item.id,
                "quantity": item.quantity,
                "price": db_item.price,
                "total": item_total
            })

        final_amount = total_amount + tax_amount - data.discount 

        # --------- If not exist create ----------
        if not customer:
            customer = Customer(
                name = data.customer_name,
                phone = data.customer_phone,
                bussiness_id = bussiness_id,
                balance = final_amount
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
            

        # --------- Create Invoice ----------

        invoice = Invoice(
            invoice_no = f"INV-{int(datetime.utcnow().timestamp())}",
            bussiness_id = bussiness_id,
            customer_id = customer.id,
            total_amount = final_amount,
            tax_amount = tax_amount,
            discount = data.discount,
            payment_mode = data.payment_mode,
            status="paid",
        )

        # db.add(invoice)
        # db.commit()
        # db.refresh(invoice)

        # --------- save invoice items --------

        for item in invoice_items_data:
            db.add(InvoiceItem(
                invoice_id=invoice.id,
                item_id = item['item_id'],
                quantity = item['quantity'],
                price = item['price'],
                total = item['total'],
            )) 
        
        db.commit()

        #* ------- PDF Generation Logic --------- 

        pdf_path = generate_invoice_pdf(invoice, customer) 
        # pdf_path = generate_invoice_pdf(invoice, customer, invoice_items_data) 

        invoice = Invoice(
            invoice_no = f"INV-{int(datetime.utcnow().timestamp())}",
            bussiness_id = bussiness_id,
            customer_id = customer.id,
            total_amount = final_amount,
            tax_amount = tax_amount,
            discount = data.discount,
            payment_mode = data.payment_mode,
            status="paid",
            pdf_url = pdf_path,
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)


        return invoice

    except Exception as e:
        print("------- THREE EXCEPTION BLOCK -----------")
        db.rollback()
        print("ERROR OCCUREED: " , str(e))
        traceback.print_exc()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "Stock Issues"
        )