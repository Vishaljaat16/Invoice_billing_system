from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)
from datetime import datetime
import os


def generate_invoice_pdf(invoice, customer):

    os.makedirs("invoices", exist_ok=True)

    file_path = f"invoices/{invoice.invoice_no}.pdf"

    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER
    title_style.textColor = colors.darkblue

    heading_style = styles["Heading2"]
    heading_style.textColor = colors.darkblue

    normal = styles["BodyText"]

    right = styles["BodyText"]
    right.alignment = TA_RIGHT

    elements = []

    # Company Name
    elements.append(Paragraph("<b>ABC STORE</b>", title_style))
    elements.append(Paragraph("Bhopal, Madhya Pradesh", normal))
    elements.append(Paragraph("Phone: +91-9876543210", normal))
    elements.append(Spacer(1, 20))

    # Invoice Title
    elements.append(Paragraph("<b>INVOICE</b>", heading_style))
    elements.append(Spacer(1, 15))

    # Invoice Details
    info_data = [
        ["Invoice No", invoice.invoice_no],
        ["Date", datetime.now().strftime("%d-%m-%Y %H:%M")],
        ["Customer", customer.name],
        ["Phone", customer.phone],
        ["Payment Mode", invoice.payment_mode.title()],
    ]

    info_table = Table(info_data, colWidths=[130, 320])

    info_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))

    elements.append(info_table)
    elements.append(Spacer(1, 25))


    # Item Table
    item_data = [["Description", "Qty", "Rate", "Amount"]]

    # for item in items:
    #     item_data.append([
    #         item.product_name,
    #         str(item.quantity),
    #         f"₹ {item.price:.2f}",
    #         f"₹ {item.quantity * item.price:.2f}",
    #     ])

    item_table = Table(
        item_data,
        colWidths=[220, 60, 80, 100]
    )

    item_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
    ]))

    elements.append(item_table)
    elements.append(Spacer(1, 20))

    # Total Section
    total_data = [
        ["Subtotal", f"₹ {invoice.total_amount:.2f}"],
        ["Discount", f"₹ {invoice.discount:.2f}"],
        ["Tax", f"₹ {invoice.tax_amount:.2f}"],
        ["Grand Total", f"₹ {invoice.total_amount:.2f}"],
    ]

    total_table = Table(total_data, colWidths=[320, 140])

    total_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 3), (-1, 3), colors.lightgrey),
        ("FONTNAME", (0, 3), (-1, 3), "Helvetica-Bold"),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))

    elements.append(total_table)
    elements.append(Spacer(1, 30))

    elements.append(
        Paragraph(
            "<b>Thank you for shopping with us!</b>",
            title_style
        )
    )

    elements.append(
        Paragraph(
            "This is a computer-generated invoice. No signature required.",
            normal
        )
    )

    doc.build(elements)

    return file_path
