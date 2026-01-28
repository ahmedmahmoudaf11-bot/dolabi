// --------------------- استدعاء مكتبة Express ---------------------
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); // لرفع الصور
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// --------------------- تخزين الصور المرفوعة ---------------------
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --------------------- عرض الملفات الثابتة ---------------------
app.use(express.static('public'));  // الملفات الأساسية: index.html + style.css
app.use('/uploads', express.static('uploads')); // الصور المرفوعة

// --------------------- مسار رفع الصور من لوحة التحكم ---------------------
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('لم يتم رفع الصورة!');
  res.json({ url: `/uploads/${req.file.filename}` }); // ارجع الرابط للمتصفح
});

// --------------------- تشغيل السيرفر ---------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
