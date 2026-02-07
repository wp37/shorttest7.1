---
description: Tạo bài kiểm tra trắc nghiệm online với timer và Google Sheets
---

# 🎯 EZTEACH QUIZ CREATOR

Skill này giúp tạo bài kiểm tra trắc nghiệm online với giao diện đẹp, timer đếm ngược, khóa thời gian, và tự động lưu kết quả lên Google Sheets.

---

## 📋 THÔNG TIN CẦN THU THẬP

Trước khi tạo quiz, hỏi người dùng các thông tin sau:

| # | Thông tin | Mặc định | Ví dụ |
|---|-----------|----------|-------|
| 1 | Chủ đề bài kiểm tra | - | Unit 7: Traffic |
| 2 | Số câu hỏi | 20 | 10, 20, 30 |
| 3 | Thời gian làm bài | 15 phút | 10, 15, 20 phút |
| 4 | Nguồn câu hỏi | NotebookLM | ID notebook hoặc tự nhập |
| 5 | Google Sheets URL | - | URL Apps Script |
| 6 | Hiển thị đáp án? | Không | Có/Không |
| 7 | **Khóa thời gian?** | Không | Ngày/giờ cụ thể |
| 8 | **Yêu cầu SĐT phụ huynh?** | Có | Có/Không |

---

## 🔧 QUY TRÌNH TẠO QUIZ

### Bước 1: Lấy câu hỏi từ NotebookLM

```
Tool: mcp_notebooklm-mcp-server_notebook_query
- notebook_id: [ID]
- query: "Tạo [số] câu hỏi trắc nghiệm về [chủ đề], 4 đáp án A-D, đánh dấu đáp án đúng"
```

### Bước 2: Tạo file index.html

**Cấu trúc chuẩn:**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <!-- Styles -->
</head>
<body>
    <!-- lockedScreen: Màn hình chờ (nếu có khóa thời gian) -->
    <!-- expiredScreen: Màn hình hết hạn -->
    <!-- startScreen: Form đăng ký -->
    <!-- quizScreen: Làm bài -->
    <!-- resultScreen: Kết quả -->
    
    <script>
        // CONFIG
        const GOOGLE_SCRIPT_URL = '[URL]';
        const QUIZ_TIME = [phút] * 60;
        
        // SCHEDULE CONFIG (nếu có khóa thời gian)
        const OPEN_TIME = new Date('YYYY-MM-DDTHH:MM:SS+07:00');
        const CLOSE_TIME = new Date('YYYY-MM-DDTHH:MM:SS+07:00');
        
        // QUIZ DATA
        const quizData = [
            { id: 1, question: "...", options: ["A", "B", "C", "D"], correct: 0 },
            // correct: 0=A, 1=B, 2=C, 3=D
        ];
    </script>
</body>
</html>
```

### Bước 3: Tạo README đáp án (cho giáo viên)

```markdown
# ĐÁP ÁN - [Tên bài]
## Bảng đáp án nhanh
| Câu | Đáp án |
## Chi tiết + Giải thích
```

---

## ⚙️ CÁC BIẾN CẦN CẤU HÌNH

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `GOOGLE_SCRIPT_URL` | URL Google Apps Script | `https://script.google.com/.../exec` |
| `QUIZ_TIME` | Thời gian làm bài (giây) | `15 * 60` = 15 phút |
| `OPEN_TIME` | Thời gian mở bài | `new Date('2026-02-07T19:00:00+07:00')` |
| `CLOSE_TIME` | Thời gian đóng bài | `new Date('2026-02-07T19:30:00+07:00')` |
| `quizData` | Mảng câu hỏi | Xem format ở trên |

---

## 📱 TÍNH NĂNG CHỐNG GIAN LẬN

### 1. Số điện thoại phụ huynh

- Bắt buộc nhập trước khi làm bài
- Validate format 10-11 số
- Lưu vào Google Sheets cùng kết quả
- Hiển thị trên màn hình kết quả

### 2. Khóa thời gian làm bài

- **Trước giờ mở**: Hiển thị đếm ngược
- **Trong giờ làm**: Cho phép vào làm bài
- **Sau giờ đóng**: Hiển thị "Đã hết thời gian"

### 3. Ẩn đáp án

- Không hiển thị nút "Xem đáp án"
- Chỉ giáo viên có file README

---

## 📊 GOOGLE SHEETS SETUP

### Cấu trúc Sheet với SĐT Phụ huynh

| Cột A | Cột B | Cột C | Cột D | Cột E |
|-------|-------|-------|-------|-------|
| Thời gian | Họ tên | Lớp | SĐT Phụ huynh | Điểm |

### Google Apps Script Code

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name,
    data.className,
    data.parentPhone,
    data.score
  ]);
  return ContentService.createTextOutput("OK");
}
```

### Deploy

1. Extensions → Apps Script
2. Dán code → Save
3. Deploy → New deployment → Web app
4. Execute as: Me | Access: Anyone
5. Copy URL

---

## 🎨 TÙY CHỈNH GIAO DIỆN

### Màu sắc

- Primary: Indigo/Purple gradient
- Success: Emerald/Teal
- Warning: Amber/Orange
- Error: Red/Rose

### Timer Warning
>
- > 3 phút: Xanh lá
- 1-3 phút: Vàng cam
- < 1 phút: Đỏ nhấp nháy

### Kết quả

- ≥ 9: 🏆 Xuất sắc + Confetti
- 7-8.9: 🌟 Giỏi lắm
- 5-6.9: 👍 Khá tốt
- < 5: 💪 Cần cố gắng

---

## 📁 FILE OUTPUT

```
project-folder/
├── index.html          # Quiz chính (upload GitHub)
├── README_DAP_AN.md    # Đáp án GV (KHÔNG upload)
└── .agent/workflows/create-quiz.md
```

---

## ✅ CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Đủ số câu hỏi theo yêu cầu
- [ ] Timer hoạt động đúng
- [ ] Khóa thời gian đúng ngày/giờ
- [ ] Form yêu cầu SĐT phụ huynh
- [ ] Google Sheets URL đã cập nhật
- [ ] Apps Script có cột SĐT phụ huynh
- [ ] Ẩn/hiện đáp án đúng
- [ ] README đáp án đã tạo
- [ ] Test thử trước deploy

---

## 💬 CÂU LỆNH MẪU

### Tạo quiz mới

```
/create-quiz
- Chủ đề: Unit 8: Films
- 20 câu, 15 phút
- Lấy từ NotebookLM notebook [ID]
- Khóa thời gian: 20h ngày 10/2/2026
- Yêu cầu SĐT phụ huynh
- Ẩn đáp án
- Google Sheets: [URL]
```

### Cập nhật thời gian

```
Đổi thời gian mở bài thành 19h ngày 15/2/2026
Cho phép vào trong 1 tiếng (19h - 20h)
```

### Tạo đề khác

```
Tạo thêm 1 đề khác với câu hỏi ngẫu nhiên từ cùng nguồn
Khóa thời gian: 20h ngày 14/2/2026
```

---

## 📞 LIÊN HỆ

**Thầy Võ Ngọc Tùng**

- 💬 Zalo: [0914666040](https://zalo.me/0914666040)
- 📘 Facebook: [vongoctungthcs](https://facebook.com/vongoctungthcs)
