export const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế']

export const PROVINCES = [
    'An Giang',
    'Bắc Ninh',
    'Cà Mau',
    'Cao Bằng',
    'Đắk Lắk',
    'Điện Biên',
    'Đồng Nai',
    'Đồng Tháp',
    'Gia Lai',
    'Hà Tĩnh',
    'Hưng Yên',
    'Khánh Hòa',
    'Lai Châu',
    'Lạng Sơn',
    'Lào Cai',
    'Lâm Đồng',
    'Nghệ An',
    'Ninh Bình',
    'Phú Thọ',
    'Quảng Ngãi',
    'Quảng Ninh',
    'Quảng Trị',
    'Sơn La',
    'Tây Ninh',
    'Thái Nguyên',
    'Thanh Hóa',
    'Tuyên Quang',
    'Vĩnh Long',
]

export const REGIONS = [...CITIES, ...PROVINCES]

export const REGION_GROUPS = [
    { label: 'Thành phố', options: CITIES },
    { label: 'Tỉnh', options: PROVINCES },
]