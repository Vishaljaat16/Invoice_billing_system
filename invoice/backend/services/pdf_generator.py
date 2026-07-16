from fastapi import APIRouter
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet

router = APIRouter()

def generate_invoice_pdf(invoice):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4
    )

    styles = getSampleStyleSheet()

    elements = []

    # Company Name
    elements.append(
        Paragraph(
            "<b>My Company Pvt Ltd</b>",
            styles["Title"]
        )
    )

    elements.append(
        Paragraph(
            "Invoice",
            styles["Heading2"]
        )
    )

    elements.append(Spacer(1, 20))

    # Customer Details
    elements.append(
        Paragraph(
            f"Customer: {invoice['customer_name']}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Phone: {invoice['customer_phone']}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 20))

    # Table Data
    data = [
        ["Item", "Qty", "Price", "Total"]
    ]

    grand_total = 0

    for item in invoice["items"]:

        total = item["quantity"] * item["price"]

        grand_total += total

        data.append([
            item["name"],
            str(item["quantity"]),
            str(item["price"]),
            str(total)
        ])

    data.append(["", "", "Grand Total", str(grand_total)])

    table = Table(data)

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ])
    )

    elements.append(table)

    doc.build(elements)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf

@router.get("/invoice/{invoice_id}/pdf")
def download_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):

    invoice = db.query(Invoice)\
        .filter(Invoice.id == invoice_id)\
        .first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice Not Found"
        )

    customer = db.query(Customer)\
        .filter(Customer.id == invoice.customer_id)\
        .first()

