from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_invoice_pdf(invoice_id):
    file_path = f"invoices/{invoice_id}.pdf"

    c = canvas.Canvas(file_path, pagesize=letter)

    c.drawString(100, 750, f"Invoice ID: {invoice_id}")
    c.drawString(100, 730, "Thank you for your purchase!")

    c.save()
    return file_path