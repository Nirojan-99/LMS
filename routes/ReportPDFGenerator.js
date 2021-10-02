const Router = require("express").Router;
const router = Router();
const PDFDocument = require("pdfkit");
const fs = require('fs');
const path = require('path');

router.get("/get_report/",(req, res, next)=>{

    const insightName = "insight"+"someID"+".pdf"
    const insightPath = path.join("Reports","Attandance",insightName)
    const PDFKit = new PDFDocument()
    PDFKit.pipe(fs.createWriteStream(insightPath))
    // res.setHeader('Content-Type','application/pdf')
    // res.setHeader('Content-Disposition','inline; filename = "'+ insightName+'"')
    
    const data =["niro","kamal","sumar","dumt"]

    PDFKit.fillColor('blue').text("hello \t world")
    PDFKit.text("hello")
    data.map((row)=>{
        PDFKit.text(row)
        PDFKit.text("\n")
    })
    PDFKit.end()
    res.status(200).json({ created: true });
    // PDFKit.pipe(res)
})


module.exports = router;

