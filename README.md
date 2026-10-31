# 🌱 Mầm Xanh — Website bán cây giống

Đồ án môn **Lập trình Frontend**, xây dựng giao diện website thương mại điện tử bán cây giống bằng **React**, sử dụng **WebStorm** làm môi trường phát triển.

> Tài liệu mô tả phạm vi và kế hoạch triển khai dự kiến của nhóm. Cập nhật tiến độ, công nghệ và hướng dẫn cài đặt theo mã nguồn thực tế khi thực hiện.

## 1. Giới thiệu đề tài

**Mầm Xanh** là website bán cây giống, giúp khách hàng tìm kiếm sản phẩm, tham khảo đặc điểm và cách chăm sóc cây, thêm sản phẩm vào giỏ hàng và thực hiện quy trình đặt hàng.

Các nhóm sản phẩm dự kiến:

- Cây giống ăn quả: xoài, ổi, mít, chanh, bưởi.
- Cây giống rau và gia vị: cà chua, ớt, húng quế, bạc hà.
- Cây hoa và cây cảnh: hoa hồng, hoa giấy, trầu bà, lưỡi hổ.

Sản phẩm được bán theo **cây hoặc bầu giống**, với thông tin về chiều cao, quy cách và điều kiện chăm sóc phù hợp.

## 2. Mục tiêu

- Vận dụng React để xây dựng giao diện từ các component có thể tái sử dụng.
- Thực hành sử dụng props, state và hooks để quản lý dữ liệu và tương tác.
- Xây dựng luồng mua hàng từ xem sản phẩm đến xác nhận đơn.
- Thực hành điều hướng trang, xử lý biểu mẫu và lưu dữ liệu trên trình duyệt.
- Thiết kế giao diện phù hợp với điện thoại, máy tính bảng và máy tính.
- Rèn luyện kỹ năng phân chia công việc và phối hợp xây dựng dự án nhóm.

## 3. Chức năng dự kiến

### Trang chủ

- Hiển thị banner giới thiệu cửa hàng và chương trình ưu đãi.
- Hiển thị danh mục, cây giống nổi bật và sản phẩm mới.
- Giới thiệu lợi ích khi mua cây giống tại cửa hàng.

### Danh sách sản phẩm

- Hiển thị ảnh, tên cây, giá bán và nút xem chi tiết.
- Tìm kiếm cây giống theo tên.
- Lọc sản phẩm theo danh mục và khoảng giá.
- Sắp xếp giá từ thấp đến cao hoặc từ cao đến thấp.
- Hiển thị thông báo khi không tìm thấy sản phẩm phù hợp.

### Chi tiết sản phẩm

- Hiển thị ảnh, tên cây, giá bán, mô tả và số lượng còn lại theo dữ liệu mẫu.
- Cung cấp thông tin về chiều cao cây, quy cách bầu và điều kiện trồng.
- Hướng dẫn cơ bản về ánh sáng, tưới nước và chăm sóc.
- Cho phép chọn số lượng và thêm sản phẩm vào giỏ hàng.
- Gợi ý các cây giống cùng danh mục.

### Giỏ hàng

- Hiển thị các sản phẩm đã chọn, đơn giá, số lượng và thành tiền.
- Cho phép tăng, giảm số lượng hoặc xóa sản phẩm.
- Tính tổng tiền hàng và tổng thanh toán theo phí giao hàng mẫu.
- Lưu giỏ hàng bằng `localStorage` để giữ dữ liệu sau khi tải lại trang.
- Hiển thị trạng thái giỏ hàng trống và liên kết tiếp tục mua sắm.

### Đặt hàng

- Nhập họ tên, số điện thoại, địa chỉ nhận hàng và ghi chú.
- Kiểm tra dữ liệu bắt buộc trước khi xác nhận.
- Hiển thị thông tin sản phẩm và tổng tiền để khách hàng kiểm tra.
- Mô phỏng đặt hàng với phương thức thanh toán khi nhận hàng (COD).
- Hiển thị xác nhận đặt hàng thành công và xóa giỏ hàng sau khi hoàn tất.

### Nội dung hỗ trợ

- Trang giới thiệu cửa hàng và thông tin liên hệ mẫu.
- Góc chăm sóc cây với các bài hướng dẫn trồng và chăm sóc cây giống.
- Trang thông báo khi đường dẫn không tồn tại.

## 4. Phạm vi thực hiện

Phiên bản đề xuất tập trung vào **frontend**:

- Sử dụng dữ liệu cây giống mẫu trong dự án.
- Xử lý tìm kiếm, lọc, sắp xếp và tính tiền tại trình duyệt.
- Sử dụng `localStorage` để lưu giỏ hàng; thông tin người nhận chỉ dùng trong luồng đặt hàng mô phỏng.
- Quy trình đặt hàng là mô phỏng, chưa gửi đơn đến máy chủ hoặc xử lý thanh toán thực tế.

Nếu giảng viên yêu cầu backend hoặc API, nhóm sẽ cập nhật phạm vi và tích hợp nguồn dữ liệu tương ứng.

## 5. Công nghệ dự kiến

| Công nghệ / công cụ | Mục đích |
| --- | --- |
| React | Xây dựng giao diện theo component |
| JavaScript | Xử lý dữ liệu và tương tác |
| HTML, CSS | Xây dựng bố cục, định dạng và giao diện responsive |
| React Router | Điều hướng giữa các trang |
| Context API và hooks | Quản lý trạng thái giỏ hàng |
| localStorage | Lưu giỏ hàng trên trình duyệt |
| Vite | Khởi tạo dự án và chạy môi trường phát triển |
| WebStorm | Viết mã và chạy dự án |
| Git | Quản lý phiên bản và phối hợp làm việc nhóm |

## 6. Cấu trúc thư mục đề xuất

```text
mam-xanh/
├── public/
├── src/
│   ├── assets/          # Hình ảnh và tài nguyên giao diện
│   ├── components/      # Header, Footer, ProductCard, bộ lọc...
│   ├── context/         # Trạng thái và thao tác giỏ hàng
│   ├── data/            # Dữ liệu sản phẩm và bài viết mẫu
│   ├── pages/           # Các trang của website
│   ├── styles/          # CSS dùng chung
│   ├── utils/           # Định dạng tiền, kiểm tra biểu mẫu...
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## 7. Hướng dẫn chạy dự án trong WebStorm

Hướng dẫn dưới đây áp dụng sau khi có mã nguồn React + Vite với script `dev` trong `package.json`.

### Yêu cầu

- Đã cài Node.js và npm, với phiên bản phù hợp với cấu hình dự án.
- Đã cài WebStorm.
- Đã tải mã nguồn dự án về máy.

### Các bước thực hiện

1. Mở WebStorm, chọn **Open** và mở thư mục dự án chứa `package.json`.
2. Mở **Terminal** trong WebStorm tại thư mục dự án.
3. Cài đặt các thư viện:

   ```bash
   npm install
   ```

4. Chạy môi trường phát triển:

   ```bash
   npm run dev
   ```

5. Mở địa chỉ được hiển thị trong Terminal bằng trình duyệt.

Dừng chương trình bằng `Ctrl + C` trong Terminal.

## 8. Định hướng giao diện

- **Màu chủ đạo:** xanh lá, trắng và be.
- **Hình ảnh:** ưu tiên ảnh cây rõ nét, cùng tỷ lệ và có nguồn sử dụng phù hợp.
- **Thẻ sản phẩm:** làm rõ tên cây, giá bán, quy cách và thao tác mua hàng.
- **Trải nghiệm:** tìm kiếm dễ thấy, bộ lọc dễ dùng và giỏ hàng dễ truy cập.
- **Khả năng sử dụng:** biểu mẫu có nhãn, lỗi nhập liệu rõ ràng và nút bấm sử dụng được bằng bàn phím.

## 9. Kế hoạch kiểm tra

- [ ] Điều hướng được giữa các trang và xử lý đường dẫn không tồn tại.
- [ ] Tìm kiếm, lọc và sắp xếp trả về sản phẩm đúng với dữ liệu mẫu.
- [ ] Trang chi tiết hiển thị đúng cây giống được chọn.
- [ ] Thêm cùng một sản phẩm nhiều lần sẽ cộng số lượng trong giỏ.
- [ ] Không cho đặt số lượng âm, bằng 0 hoặc vượt số lượng có sẵn.
- [ ] Tổng tiền cập nhật đúng sau khi thay đổi số lượng hoặc xóa sản phẩm.
- [ ] Giỏ hàng vẫn được giữ sau khi tải lại trang.
- [ ] Biểu mẫu phát hiện thông tin còn thiếu và số điện thoại không hợp lệ.
- [ ] Không thể đặt hàng khi giỏ hàng trống.
- [ ] Xác nhận đơn thành công hiển thị đúng thông tin và làm trống giỏ hàng.
- [ ] Giao diện không bị tràn ngang trên điện thoại và máy tính bảng.

## 10. Hướng phát triển

- Kết nối backend và cơ sở dữ liệu cho sản phẩm, khách hàng và đơn hàng.
- Bổ sung đăng ký, đăng nhập và lịch sử mua hàng.
- Xây dựng trang quản trị sản phẩm, tồn kho và đơn hàng.
- Bổ sung đánh giá sản phẩm, mã giảm giá và danh sách yêu thích.
- Tích hợp thanh toán trực tuyến và theo dõi trạng thái giao hàng.

## 11. Thông tin nhóm

| Nội dung | Thông tin |
| --- | --- |
| Môn học | Lập trình Frontend |
| Tên đề tài | Thiết kế và xây dựng giao diện website bán cây giống bằng React |
| Tên nhóm | [Điền tên nhóm] |
| Lớp | [Điền tên lớp] |
| Giảng viên hướng dẫn | [Điền họ tên giảng viên] |

### Thành viên và phân công

Thêm hoặc bớt dòng theo số lượng thành viên thực tế.

| Họ và tên | Mã sinh viên | Công việc phụ trách |
| --- | --- | --- |
| [Họ tên] | [Mã sinh viên] | [Trang / chức năng phụ trách] |

---

Dự án phục vụ mục đích học tập. Thông tin sản phẩm, giá bán, tồn kho và đơn hàng trong bản demo là dữ liệu mẫu.
