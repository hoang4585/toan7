import { useState, useEffect } from "react";

const SOLUTION_PASSWORD = "vuihoc";

function normalizeForCompare(str) {
  return (str || "").toString().trim().toLowerCase().replace(/\s+/g, "").replace(/\.+$/, "");
}

function checkAnswer(given, correct) {
  const g = normalizeForCompare(given);
  const c = normalizeForCompare(correct);
  if (!g) return null;
  if (g === c) return true;
  const gNum = g.replace(/[^0-9.,\/\-]/g, "");
  const cNum = c.replace(/[^0-9.,\/\-]/g, "");
  if (gNum && cNum && gNum === cNum) return true;
  if (c.length > 8 && (g.includes(c) || c.includes(g))) return true;
  return false;
}

const inkColor = "#2B2620";
const marginRed = "#B5433D";
const correctGreen = "#4E7A51";
const algebraBlue = "#3D5A80";
const geoOrange = "#B5763D";

const font = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    .lt-serif { font-family: 'Newsreader', Georgia, serif; }
    body, .lt-root { font-family: 'Inter', -apple-system, sans-serif; color: #2B2620; }
    .lt-page { background: #FBF8F2; border: 1px solid #E4DCC8; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .lt-margin { position: absolute; left: 32px; top: 0; bottom: 0; width: 1px; background: #E8B4B0; opacity: 0.5; }
    .lt-tab { transition: all 0.15s ease; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .gap-3 { gap: 12px; }
    textarea, input { font-family: inherit; }
    .lt-summary { line-height: 1.8; font-size: 15px; }
    .lt-summary h2 { font-family: 'Newsreader', Georgia, serif; font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #2B2620; }
    .lt-summary h3, .lt-summary strong { color: #2B2620; }
    .lt-summary ul { padding-left: 20px; margin: 8px 0 16px; }
    .lt-summary li { margin-bottom: 6px; }
    .lt-summary p { margin: 0 0 12px; }
    .lt-summary table { border-collapse: collapse; width: 100%; margin: 12px 0 18px; font-size: 14px; }
    .lt-summary th, .lt-summary td { border: 1px solid #D9CFC0; padding: 8px 10px; text-align: left; }
    .lt-summary th { background: #F3EEE3; }
  `}</style>
);

const CATEGORIES = [
  { id: "dai-so", label: "Đại số", color: algebraBlue, icon: "Σ" },
  { id: "hinh-hoc", label: "Hình học", color: geoOrange, icon: "△" },
];

const CHUYEN_DE = 
[
  {
    "id": "d1-so-huu-ti",
    "category": "dai-so",
    "title": "Số hữu tỉ và các phép toán",
    "summary": "## Số hữu tỉ và các phép toán\n\n**Định nghĩa:** Số hữu tỉ là số viết được dưới dạng a/b (a, b ∈ ℤ, b ≠ 0), ký hiệu tập hợp là **ℚ**.\n\n**Các phép toán:** cộng, trừ (quy đồng mẫu), nhân (tử nhân tử, mẫu nhân mẫu), chia (nhân với phân số nghịch đảo).\n\n### Phương pháp thường dùng ở lớp chuyên\n- **Kỹ thuật ghép cặp:** khi tính tổng nhiều số hạng, tìm cách ghép các số đối nhau hoặc ghép để tạo ra kết quả tròn.\n- **Kỹ thuật rút gọn dây chuyền (tích các phân số liên tiếp):** khi tử của phân số sau trùng mẫu của phân số trước, chúng triệt tiêu nhau, chỉ còn tử đầu và mẫu cuối.\n- **Kỹ thuật tách phân số kiểu viễn vọng (telescoping):** viết 1/(n(n+k)) = (1/k)[1/n − 1/(n+k)] để tổng nhiều số hạng liên tiếp triệt tiêu phần giữa, chỉ còn số hạng đầu và cuối.\n- **Kỹ thuật ước lượng khi so sánh:** so sánh phân số phức tạp với các mốc quen thuộc (1, 1/2...) trước khi quy đồng trực tiếp.",
    "advanced": [
      {
        "prompt": "Tính nhanh: 1/2 × 2/3 × 3/4 × ... × 9/10",
        "solution": "Rút gọn dây chuyền: tử của phân số sau bằng mẫu của phân số liền trước, triệt tiêu hết.\nKết quả = 1/10 (chỉ còn tử đầu 1 và mẫu cuối 10).",
        "answer": "1/10"
      },
      {
        "prompt": "Ba số hữu tỉ a, b, c thỏa a/2=b/3=c/5 và a−b+c=8. Tìm a, b, c.",
        "solution": "Đặt a=2k, b=3k, c=5k. a-b+c=2k-3k+5k=4k=8 → k=2.\nVậy a=4, b=6, c=10.",
        "answer": "a=4, b=6, c=10"
      },
      {
        "prompt": "Tìm x nguyên biết: −3 < x/2 < 2",
        "solution": "Nhân cả 2 vế với 2: -6<x<4.\nCác giá trị x nguyên thỏa mãn: -5,-4,-3,-2,-1,0,1,2,3.",
        "answer": "-5,-4,-3,-2,-1,0,1,2,3"
      },
      {
        "prompt": "Tính: (1/2−1/3)×(1/3−1/4)×(1/4−1/5)",
        "solution": "1/2-1/3=1/6. 1/3-1/4=1/12. 1/4-1/5=1/20.\nTích = 1/6×1/12×1/20 = 1/1440.",
        "answer": "1/1440"
      },
      {
        "prompt": "Tính nhanh: 2/3 + 2/(3×5) + 2/(5×7) + 2/(7×9) (dùng kỹ thuật viễn vọng, viết 2/3=2/(1×3)).",
        "solution": "Viết lại: 2/(1×3)+2/(3×5)+2/(5×7)+2/(7×9).\nMỗi số hạng 2/(n(n+2)) = 1/n − 1/(n+2). Tổng = (1-1/3)+(1/3-1/5)+(1/5-1/7)+(1/7-1/9) = 1-1/9 = 8/9.",
        "answer": "8/9"
      }
    ],
    "quiz": [
      {
        "prompt": "Kết quả của phép tính 1/2 + 1/3 là?",
        "options": [
          "2/5",
          "5/6",
          "1/6",
          "3/5"
        ],
        "correct": 1,
        "explain": "Quy đồng mẫu 6: 3/6+2/6=5/6."
      },
      {
        "prompt": "Số nào sau đây KHÔNG phải là số hữu tỉ?",
        "options": [
          "3/4",
          "-5",
          "π",
          "0"
        ],
        "correct": 2,
        "explain": "π là số vô tỉ (thập phân vô hạn không tuần hoàn), không viết được dưới dạng a/b."
      },
      {
        "prompt": "Kết quả (-2/3)×(3/4) bằng?",
        "options": [
          "-1/2",
          "1/2",
          "-3/2",
          "2/3"
        ],
        "correct": 0,
        "explain": "(-2×3)/(3×4)=-6/12=-1/2."
      },
      {
        "prompt": "Số hữu tỉ x thỏa 2x=3/4. Giá trị x bằng?",
        "options": [
          "3/8",
          "3/2",
          "8/3",
          "6/4"
        ],
        "correct": 0,
        "explain": "x=3/4:2=3/4×1/2=3/8."
      }
    ]
  },
  {
    "id": "d2-gia-tri-tuyet-doi",
    "category": "dai-so",
    "title": "Giá trị tuyệt đối",
    "summary": "## Giá trị tuyệt đối\n\n**Định nghĩa:** |x| = x nếu x ≥ 0; |x| = −x nếu x < 0. Luôn có |x| ≥ 0.\n\n**Tính chất quan trọng:**\n- |x| = |y| ⟺ x = y hoặc x = −y\n- |x| + |y| ≥ |x + y| (dấu \"=\" xảy ra khi x, y cùng dấu hoặc một trong hai bằng 0)\n\n### Phương pháp giải phương trình / bất phương trình chứa dấu giá trị tuyệt đối\n- **Phá dấu theo từng trường hợp:** xét dấu của biểu thức bên trong để bỏ dấu giá trị tuyệt đối, giải riêng từng trường hợp rồi đối chiếu điều kiện.\n- **Với |A| = B (B chứa biến):** cần điều kiện B ≥ 0 trước khi xét A = B hoặc A = −B.\n- **Với tổng |x−a| + |x−b|:** giá trị nhỏ nhất của tổng này chính bằng |a−b|, đạt được khi x nằm giữa a và b (kể cả hai đầu mút). Đây là kỹ thuật quan trọng để tìm GTNN nhanh mà không cần xét từng khoảng.",
    "advanced": [
      {
        "prompt": "Giải phương trình: |2x−1| = |x+4|",
        "solution": "Trường hợp 1: 2x-1=x+4 → x=5.\nTrường hợp 2: 2x-1=-(x+4) → 3x=-3 → x=-1.\nVậy x=5 hoặc x=-1.",
        "answer": "x=5 hoặc x=-1"
      },
      {
        "prompt": "Tìm giá trị nhỏ nhất của biểu thức |x−1/2| + |x+1/3| và giá trị x đạt được.",
        "solution": "Biểu thức là tổng khoảng cách từ x đến 1/2 và từ x đến -1/3.\nGiá trị nhỏ nhất = khoảng cách giữa 2 điểm = 1/2-(-1/3) = 5/6, đạt được khi -1/3≤x≤1/2.",
        "answer": "5/6"
      },
      {
        "prompt": "Giải phương trình: |x+2| = 3x−6 (chú ý điều kiện vế phải không âm).",
        "solution": "Cần 3x-6≥0 → x≥2.\nTH1: x+2=3x-6 → x=4 (thỏa x≥2).\nTH2: -(x+2)=3x-6 → x=1 (không thỏa x≥2, loại).\nVậy x=4.",
        "answer": "4"
      },
      {
        "prompt": "Giải bất phương trình: |x−3| < 5",
        "solution": "|x-3|<5 tương đương -5<x-3<5.\nCộng 3 vào cả 3 vế: -2<x<8.",
        "answer": "-2<x<8"
      },
      {
        "prompt": "Tìm x biết: |x−2| + |x−5| = 3 (gợi ý: dùng tính chất GTNN của tổng khoảng cách).",
        "solution": "Vì |5-2|=3 đúng bằng vế phải, đẳng thức xảy ra khi x nằm giữa 2 điểm 2 và 5 (kể cả 2 đầu mút).\nVậy nghiệm: 2≤x≤5 (vô số nghiệm).",
        "answer": "2≤x≤5"
      }
    ],
    "quiz": [
      {
        "prompt": "|−5| bằng?",
        "options": [
          "5",
          "-5",
          "0",
          "Không xác định"
        ],
        "correct": 0,
        "explain": "Giá trị tuyệt đối của số âm là số đối của nó."
      },
      {
        "prompt": "Nếu |x|=7 thì x bằng?",
        "options": [
          "Chỉ 7",
          "Chỉ -7",
          "7 hoặc -7",
          "Không có x"
        ],
        "correct": 2,
        "explain": "Cả 7 và -7 đều có giá trị tuyệt đối bằng 7."
      },
      {
        "prompt": "|3−8| bằng?",
        "options": [
          "5",
          "-5",
          "11",
          "-11"
        ],
        "correct": 0,
        "explain": "|3-8|=|-5|=5."
      },
      {
        "prompt": "Với mọi số thực x, |x| luôn:",
        "options": [
          "Dương",
          "Âm",
          "Không âm",
          "Bằng x"
        ],
        "correct": 2,
        "explain": "|x|≥0 với mọi x (có thể bằng 0 khi x=0)."
      }
    ]
  },
  {
    "id": "d3-luy-thua",
    "category": "dai-so",
    "title": "Lũy thừa của số hữu tỉ",
    "summary": "## Lũy thừa của số hữu tỉ\n\n**Công thức cơ bản** (x, y ∈ ℚ; m, n ∈ ℕ):\n- xᵐ · xⁿ = xᵐ⁺ⁿ\n- xᵐ : xⁿ = xᵐ⁻ⁿ (x ≠ 0, m ≥ n)\n- (xᵐ)ⁿ = xᵐⁿ\n- (x·y)ⁿ = xⁿ·yⁿ\n- (x/y)ⁿ = xⁿ/yⁿ (y ≠ 0)\n\n**Dấu của lũy thừa số âm:** số mũ chẵn cho kết quả dương, số mũ lẻ giữ nguyên dấu âm.\n\n### Phương pháp thường dùng\n- **Đưa về cùng cơ số hoặc cùng số mũ** để so sánh 2 lũy thừa lớn — đây là kỹ thuật cốt lõi khi so sánh các số như 2³⁰ và 3²⁰.\n- **Tách/ghép lũy thừa** để rút gọn biểu thức phức tạp thành dạng đơn giản trước khi tính.\n- Với bài tìm x dạng aˣ = aⁿ (cùng cơ số), suy ra ngay x = n.",
    "advanced": [
      {
        "prompt": "So sánh (−2/3)¹⁰ và (2/3)¹⁰ (không tính giá trị cụ thể).",
        "solution": "Lũy thừa bậc chẵn của một số âm bằng lũy thừa cùng bậc của số đối (dương) của nó.\nVậy hai số này bằng nhau.",
        "answer": "Bằng nhau"
      },
      {
        "prompt": "Tính: (−1/2)² + (−1/3)³",
        "solution": "(-1/2)²=1/4. (-1/3)³=-1/27.\nQuy đồng mẫu 108: 27/108-4/108=23/108.",
        "answer": "23/108"
      },
      {
        "prompt": "So sánh 2³⁰ và 3²⁰ (đưa về cùng số mũ).",
        "solution": "2³⁰=(2³)¹⁰=8¹⁰. 3²⁰=(3²)¹⁰=9¹⁰.\nVì 8<9 nên 8¹⁰<9¹⁰, tức 2³⁰<3²⁰.",
        "answer": "2³⁰ < 3²⁰"
      },
      {
        "prompt": "Tính giá trị biểu thức: (2⁵×3⁴)/(2³×3²)",
        "solution": "= 2⁵⁻³ × 3⁴⁻² = 2²×3² = 4×9 = 36.",
        "answer": "36"
      },
      {
        "prompt": "Tìm x biết: 2ˣ = 32",
        "solution": "32 = 2⁵.\nVậy x=5.",
        "answer": "5"
      }
    ],
    "quiz": [
      {
        "prompt": "2³×2² bằng?",
        "options": [
          "2⁵",
          "2⁶",
          "4⁵",
          "4⁶"
        ],
        "correct": 0,
        "explain": "Cộng số mũ khi cùng cơ số: 2³⁺²=2⁵."
      },
      {
        "prompt": "(−2)² bằng?",
        "options": [
          "-4",
          "4",
          "-2",
          "2"
        ],
        "correct": 1,
        "explain": "Số mũ chẵn của số âm cho kết quả dương: (-2)²=4."
      },
      {
        "prompt": "(−2)³ bằng?",
        "options": [
          "8",
          "-8",
          "6",
          "-6"
        ],
        "correct": 1,
        "explain": "Số mũ lẻ giữ nguyên dấu âm: (-2)³=-8."
      },
      {
        "prompt": "(x²)³ bằng?",
        "options": [
          "x⁵",
          "x⁶",
          "x⁹",
          "2x⁶"
        ],
        "correct": 1,
        "explain": "Nhân số mũ: (x²)³=x²ˣ³=x⁶."
      }
    ]
  },
  {
    "id": "d4-ti-le-thuc",
    "category": "dai-so",
    "title": "Tỉ lệ thức — Dãy tỉ số bằng nhau",
    "summary": "## Tỉ lệ thức — Dãy tỉ số bằng nhau\n\n**Tỉ lệ thức:** a/b = c/d (b, d ≠ 0). Tính chất cơ bản: a/b = c/d ⟺ a·d = b·c (tích chéo).\n\n**Tính chất dãy tỉ số bằng nhau:**\na/b = c/d = (a+c)/(b+d) = (a−c)/(b−d) (với điều kiện các mẫu tương ứng khác 0)\n\n### Phương pháp giải toán chia tỉ lệ\n1. Đặt các đại lượng cần tìm tỉ lệ với các số cho trước bằng cách gọi chung 1 ẩn phụ k.\n2. Biểu diễn tất cả các đại lượng theo k.\n3. Dùng dữ kiện đề bài (tổng, hiệu, hoặc một hệ thức khác) để lập phương trình tìm k.\n4. Thay k trở lại để tìm các đại lượng ban đầu.\n\nĐây là kỹ thuật nền tảng cho hầu hết các bài toán tỉ lệ ở cấp THCS.",
    "advanced": [
      {
        "prompt": "Tìm x, y, z biết x/2=y/3=z/4 và x+y+z=54.",
        "solution": "Đặt x=2k, y=3k, z=4k. x+y+z=9k=54 → k=6.\nVậy x=12, y=18, z=24.",
        "answer": "x=12, y=18, z=24"
      },
      {
        "prompt": "Ba số tỉ lệ với 3, 5, 7 và tổng bình phương của chúng bằng 332. Tìm 3 số.",
        "solution": "Đặt 3 số là 3k, 5k, 7k. (3k)²+(5k)²+(7k)²=83k²=332 → k²=4 → k=2.\nBa số: 6, 10, 14.",
        "answer": "6, 10, 14"
      },
      {
        "prompt": "Tìm 2 số biết tỉ số của chúng là 3:5 và tổng bằng 96.",
        "solution": "Đặt số thứ nhất=3k, số thứ hai=5k. 3k+5k=96 → 8k=96 → k=12.\nSố thứ nhất=36, số thứ hai=60.",
        "answer": "36 và 60"
      },
      {
        "prompt": "Ba đội công nhân có số người tỉ lệ 2:3:4, tổng 3 đội là 90 người. Tìm số người mỗi đội.",
        "solution": "Đặt 2k, 3k, 4k. 2k+3k+4k=9k=90 → k=10.\nĐội 1: 20 người, đội 2: 30 người, đội 3: 40 người.",
        "answer": "20, 30, 40 người"
      },
      {
        "prompt": "Tìm x, y biết x:y=2:5 và y−x=9.",
        "solution": "Đặt x=2k, y=5k. y-x=3k=9 → k=3.\nx=6, y=15.",
        "answer": "x=6, y=15"
      }
    ],
    "quiz": [
      {
        "prompt": "Nếu a/b=c/d thì:",
        "options": [
          "a×c=b×d",
          "a×d=b×c",
          "a+b=c+d",
          "a-c=b-d"
        ],
        "correct": 1,
        "explain": "Tính chất tích chéo của tỉ lệ thức."
      },
      {
        "prompt": "Tỉ lệ thức 2/3=x/9 thì x bằng?",
        "options": [
          "6",
          "3",
          "13,5",
          "4,5"
        ],
        "correct": 0,
        "explain": "x=2×9/3=6."
      },
      {
        "prompt": "a/2=b/5, biết a=6. Tìm b?",
        "options": [
          "10",
          "15",
          "3",
          "12"
        ],
        "correct": 1,
        "explain": "a/2=3, nên b=5×3=15."
      },
      {
        "prompt": "Theo tính chất dãy tỉ số bằng nhau, a/b=c/d=(a+c)/?",
        "options": [
          "b-d",
          "b+d",
          "bd",
          "b/d"
        ],
        "correct": 1,
        "explain": "a/b=c/d=(a+c)/(b+d)."
      }
    ]
  },
  {
    "id": "d5-ti-le-thuan-nghich",
    "category": "dai-so",
    "title": "Đại lượng tỉ lệ thuận — tỉ lệ nghịch",
    "summary": "## Đại lượng tỉ lệ thuận — tỉ lệ nghịch\n\n**Tỉ lệ thuận:** y tỉ lệ thuận với x nếu y = kx (k ≠ 0). Tỉ số y/x luôn không đổi.\n\n**Tỉ lệ nghịch:** y tỉ lệ nghịch với x nếu y = k/x, tức xy = k (k ≠ 0). Tích x·y luôn không đổi.\n\n### Phương pháp\nBước quan trọng nhất là **xác định đúng bản chất quan hệ** (thuận hay nghịch) trước khi lập biểu thức:\n- Cùng năng suất mỗi người: **số người và thời gian hoàn thành** tỉ lệ **nghịch**.\n- Cùng quãng đường: **vận tốc và thời gian** tỉ lệ **nghịch**.\n- Số lượng và tổng giá tiền (đơn giá không đổi): tỉ lệ **thuận**.\n\nVới bài chia 1 số thành các phần tỉ lệ nghịch với các số a, b, c — chuyển về chia tỉ lệ thuận với 1/a, 1/b, 1/c rồi quy đồng để có tỉ lệ đẹp, sau đó áp dụng phương pháp đặt ẩn k như chuyên đề tỉ lệ thức.",
    "advanced": [
      {
        "prompt": "Ba đội thợ có năng suất tỉ lệ 2, 3, 4, cùng làm chung 1 công việc trong 12 ngày thì xong. Nếu chỉ đội tỉ lệ 2 làm một mình thì mất bao lâu?",
        "solution": "Tổng năng suất = 2+3+4=9 phần. Công việc = 9×12=108 (đơn vị).\nĐội tỉ lệ 2 làm một mình: thời gian = 108/2 = 54 ngày.",
        "answer": "54 ngày"
      },
      {
        "prompt": "Cho y tỉ lệ nghịch với x, khi x=6 thì y=8. Hỏi khi x tăng gấp 3 thì y bằng bao nhiêu?",
        "solution": "Hằng số tỉ lệ: xy=6×8=48.\nKhi x tăng gấp 3 (x'=18): y'=48/18=8/3.",
        "answer": "8/3"
      },
      {
        "prompt": "5 người làm xong 1 công việc trong 8 ngày (cùng năng suất). Hỏi 10 người làm xong công việc đó trong bao nhiêu ngày?",
        "solution": "Số người và số ngày tỉ lệ nghịch: 5×8=10×x → x=4 ngày.",
        "answer": "4 ngày"
      },
      {
        "prompt": "Một ô tô đi quãng đường AB với vận tốc 40km/h hết 3 giờ. Nếu đi với vận tốc 60km/h thì hết bao lâu?",
        "solution": "Vận tốc và thời gian tỉ lệ nghịch (quãng đường không đổi): 40×3=60×t → t=2 giờ.",
        "answer": "2 giờ"
      },
      {
        "prompt": "Chia số 130 thành 3 phần tỉ lệ nghịch với 2, 3, 4.",
        "solution": "Tỉ lệ nghịch với 2,3,4 = tỉ lệ thuận với 1/2,1/3,1/4. Quy đồng mẫu 12: 6/12, 4/12, 3/12, tức tỉ lệ 6:4:3.\nTổng phần=13. Mỗi phần=130/13=10. Ba phần: 60, 40, 30.",
        "answer": "60, 40, 30"
      }
    ],
    "quiz": [
      {
        "prompt": "y=3x là quan hệ:",
        "options": [
          "Tỉ lệ thuận",
          "Tỉ lệ nghịch",
          "Không tỉ lệ",
          "Cả hai"
        ],
        "correct": 0,
        "explain": "Dạng y=kx là tỉ lệ thuận."
      },
      {
        "prompt": "xy=12 là quan hệ:",
        "options": [
          "Tỉ lệ thuận",
          "Tỉ lệ nghịch",
          "Không tỉ lệ",
          "Cả hai"
        ],
        "correct": 1,
        "explain": "Tích không đổi là dấu hiệu tỉ lệ nghịch."
      },
      {
        "prompt": "y tỉ lệ thuận với x, biết x=4 thì y=8. Hệ số tỉ lệ là?",
        "options": [
          "2",
          "0,5",
          "4",
          "32"
        ],
        "correct": 0,
        "explain": "k=y/x=8/4=2."
      },
      {
        "prompt": "3 người làm xong việc trong 6 ngày (cùng năng suất). 6 người làm xong trong?",
        "options": [
          "12 ngày",
          "3 ngày",
          "2 ngày",
          "18 ngày"
        ],
        "correct": 1,
        "explain": "Tỉ lệ nghịch: 3×6=6×x → x=3."
      }
    ]
  },
  {
    "id": "d6-da-thuc",
    "category": "dai-so",
    "title": "Đa thức một biến",
    "summary": "## Đa thức một biến\n\n**Đa thức một biến:** tổng của các đơn thức cùng 1 biến, dạng thu gọn P(x) = aₙxⁿ + ... + a₁x + a₀.\n\n**Bậc của đa thức:** số mũ lớn nhất của biến (sau khi đã thu gọn).\n\n**Nghiệm của đa thức:** x₀ là nghiệm của P(x) nếu P(x₀) = 0.\n\n### Phương pháp\n- **Cộng, trừ đa thức:** nhóm các hạng tử cùng bậc (đồng dạng) rồi cộng/trừ hệ số tương ứng.\n- **Tìm nghiệm:** với đa thức bậc 2 trở lên, thử nhẩm các giá trị đặc biệt (thường là ước của hệ số tự do) rồi phân tích thành nhân tử.\n- **Xác định đa thức khi biết một số điều kiện** (giá trị tại 1 vài điểm, nghiệm...): lập hệ phương trình theo các hệ số chưa biết rồi giải.\n- Khi biết đa thức có nghiệm x = a, luôn phân tích được P(x) = (x − a)·Q(x) với Q(x) là đa thức bậc thấp hơn 1.",
    "advanced": [
      {
        "prompt": "Tìm tất cả nghiệm của đa thức P(x)=x²−5x+6 và viết P(x) dưới dạng tích 2 nhân tử bậc nhất.",
        "solution": "Giải x²-5x+6=0 → (x-2)(x-3)=0 → x=2 hoặc x=3.\nVậy P(x)=(x-2)(x-3).",
        "answer": "P(x)=(x-2)(x-3); nghiệm x=2, x=3"
      },
      {
        "prompt": "Tính giá trị của đa thức A=x²−2xy+y² tại x=13, y=3.",
        "solution": "A=(x-y)² = (13-3)² = 10² = 100.",
        "answer": "100"
      },
      {
        "prompt": "Tìm đa thức bậc nhất P(x)=ax+b biết P(2)=5 và P(−1)=−4.",
        "solution": "2a+b=5. -a+b=-4. Trừ hai phương trình: 3a=9 → a=3, b=-1.\nVậy P(x)=3x-1.",
        "answer": "P(x)=3x-1"
      },
      {
        "prompt": "Đa thức Q(x) bậc 3 có 3 nghiệm là 1, 2, −3 và hệ số cao nhất là 1. Tính Q(0).",
        "solution": "Q(x)=(x-1)(x-2)(x+3).\nQ(0)=(-1)(-2)(3)=6.",
        "answer": "6"
      },
      {
        "prompt": "Cho P(x)=2x²−3x+1, Q(x)=x²+3x−4. Tìm nghiệm của P(x)−Q(x).",
        "solution": "P(x)-Q(x) = x²-6x+5.\nGiải x²-6x+5=0 → (x-1)(x-5)=0 → x=1 hoặc x=5.",
        "answer": "x=1 hoặc x=5"
      }
    ],
    "quiz": [
      {
        "prompt": "Đa thức P(x)=x²−4 có nghiệm là?",
        "options": [
          "x=4",
          "x=2 hoặc x=-2",
          "x=-4",
          "Vô nghiệm"
        ],
        "correct": 1,
        "explain": "x²-4=0 → x²=4 → x=±2."
      },
      {
        "prompt": "Bậc của đa thức 3x³−2x+5 là?",
        "options": [
          "2",
          "3",
          "5",
          "1"
        ],
        "correct": 1,
        "explain": "Bậc là số mũ cao nhất của biến, ở đây là 3."
      },
      {
        "prompt": "Giá trị đa thức P(x)=2x+1 tại x=3 là?",
        "options": [
          "5",
          "6",
          "7",
          "8"
        ],
        "correct": 2,
        "explain": "P(3)=2×3+1=7."
      },
      {
        "prompt": "(x²+3x)+(2x²−x) bằng?",
        "options": [
          "3x²+2x",
          "x²+4x",
          "3x²+4x",
          "2x²+2x"
        ],
        "correct": 0,
        "explain": "Nhóm hạng tử đồng dạng: (1+2)x²+(3-1)x=3x²+2x."
      }
    ]
  },
  {
    "id": "d7-so-thuc",
    "category": "dai-so",
    "title": "Số thực — Căn bậc hai",
    "summary": "## Số thực — Căn bậc hai\n\n**Số vô tỉ:** số thập phân vô hạn không tuần hoàn (ví dụ √2, π).\n\n**Số thực ℝ** = số hữu tỉ ∪ số vô tỉ.\n\n**Căn bậc hai số học của a ≥ 0:** là số x ≥ 0 sao cho x² = a, ký hiệu √a.\n\n### Phương pháp\n- **So sánh 2 căn:** nếu 0 ≤ a < b thì √a < √b. Với biểu thức phức tạp hơn, **bình phương cả 2 vế** (khi cả 2 vế không âm) để đưa về so sánh không chứa căn.\n- **Nhận diện bình phương ẩn trong biểu thức dưới căn** (dạng a² ± 2ab + b²) để rút gọn căn của biểu thức phức tạp thành a ± b.\n- **Chứng minh một số là vô tỉ:** thường dùng phương pháp phản chứng — giả sử số đó là hữu tỉ (viết dưới dạng phân số tối giản), suy ra mâu thuẫn.",
    "advanced": [
      {
        "prompt": "Tính: √(2²×3²×5²) (rút gọn trước khi khai căn).",
        "solution": "√(2²×3²×5²) = 2×3×5 = 30.",
        "answer": "30"
      },
      {
        "prompt": "Chứng minh √3 là số vô tỉ.",
        "solution": "Giả sử √3=a/b (phân số tối giản). Bình phương: 3b²=a², suy ra a chia hết cho 3.\nĐặt a=3k: 3b²=9k² → b²=3k², suy ra b cũng chia hết cho 3 — mâu thuẫn giả thiết tối giản.\nVậy √3 là số vô tỉ.",
        "answer": "Vô tỉ (chứng minh bằng phản chứng)"
      },
      {
        "prompt": "So sánh (không dùng máy tính): 5√2 và 7.",
        "solution": "Bình phương 2 vế: (5√2)²=50. 7²=49.\nVì 50>49 nên 5√2>7.",
        "answer": "5√2 > 7"
      },
      {
        "prompt": "Sắp xếp theo thứ tự tăng dần: √50, 7, √48",
        "solution": "7²=49. So sánh 48 và 49: 48<49 nên √48<7.\nSo sánh 50 và 49: 50>49 nên √50>7.\nVậy: √48 < 7 < √50.",
        "answer": "√48 < 7 < √50"
      },
      {
        "prompt": "Rút gọn: √(4−2√3) (nhận biết dạng (√3−1)²).",
        "solution": "4-2√3 = 3-2√3+1 = (√3-1)².\n√(4-2√3) = √3-1 (vì √3>1).",
        "answer": "√3-1"
      }
    ],
    "quiz": [
      {
        "prompt": "√16 bằng?",
        "options": [
          "4",
          "8",
          "256",
          "2"
        ],
        "correct": 0,
        "explain": "4²=16, và 4≥0 nên căn bậc hai số học của 16 là 4."
      },
      {
        "prompt": "Số nào sau đây là số vô tỉ?",
        "options": [
          "0,5",
          "4/5",
          "√2",
          "-3"
        ],
        "correct": 2,
        "explain": "√2 là số thập phân vô hạn không tuần hoàn."
      },
      {
        "prompt": "√25 + √9 bằng?",
        "options": [
          "√34",
          "8",
          "34",
          "15"
        ],
        "correct": 1,
        "explain": "5+3=8."
      },
      {
        "prompt": "So sánh √10 và 3:",
        "options": [
          "√10<3",
          "√10=3",
          "√10>3",
          "Không so sánh được"
        ],
        "correct": 2,
        "explain": "10>9=3² nên √10>3."
      }
    ]
  },
  {
    "id": "d8-thong-ke-xac-suat",
    "category": "dai-so",
    "title": "Thống kê — Xác suất",
    "summary": "## Thống kê — Xác suất\n\n**Biểu diễn dữ liệu:** bảng số liệu, biểu đồ tranh, biểu đồ cột (kể cả cột kép để so sánh), biểu đồ đoạn thẳng (thể hiện xu hướng theo thời gian).\n\n**Xác suất của biến cố** (mô hình đồng khả năng):\n\nP(biến cố) = (số kết quả thuận lợi) / (tổng số kết quả có thể xảy ra), với 0 ≤ P ≤ 1.\n\n### Phương pháp\n- **Liệt kê đầy đủ không gian mẫu** trước khi đếm — sai sót phổ biến nhất là bỏ sót hoặc đếm trùng kết quả.\n- Với bài đếm phức tạp (ví dụ gieo nhiều xúc xắc), có thể dùng **bảng liệt kê có hệ thống** (kẻ bảng 2 chiều) để không bỏ sót.\n- **Nguyên lý bù trừ** cho bài toán \"hai tập hợp giao nhau\": số phần tử thuộc ít nhất 1 trong 2 tập = |A| + |B| − |A∩B|.",
    "advanced": [
      {
        "prompt": "Một hộp có 20 thẻ đánh số 1-20. Rút 1 thẻ, tính xác suất được số chia hết cho 3 hoặc chia hết cho 4.",
        "solution": "Chia hết cho 3: 6 số (3,...,18). Chia hết cho 4: 5 số (4,...,20). Chia hết cả 2 (tức 12): 1 số.\nTheo bao hàm trừ giao: 6+5-1=10. Xác suất = 10/20 = 1/2.",
        "answer": "1/2"
      },
      {
        "prompt": "Gieo 1 xúc xắc 2 lần. Tính xác suất để lần 2 ra số lớn hơn lần 1.",
        "solution": "Tổng 36 kết quả. Số cặp bằng nhau: 6 cách. Số cặp khác nhau = 30, chia đôi cho 2 chiều: 15 cách mỗi chiều.\nXác suất = 15/36 = 5/12.",
        "answer": "5/12"
      },
      {
        "prompt": "Một túi có 4 bi đỏ, 3 bi xanh, 2 bi vàng (tổng 9 bi). Lấy ngẫu nhiên 2 bi cùng lúc. Tính xác suất 2 bi khác màu.",
        "solution": "Tổng cách chọn 2 từ 9: C(9,2)=36.\nCách 2 cùng màu: C(4,2)+C(3,2)+C(2,2)=6+3+1=10.\nKhác màu = 36-10=26. Xác suất = 26/36=13/18.",
        "answer": "13/18"
      },
      {
        "prompt": "Ba bạn A, B, C mỗi người viết ngẫu nhiên 1 số từ 1-3 (có thể trùng). Tính xác suất cả 3 bạn viết số giống nhau.",
        "solution": "Tổng cách = 3³=27.\nSố cách cả 3 giống nhau: 3 cách (cùng viết 1, hoặc cùng 2, hoặc cùng 3).\nXác suất = 3/27 = 1/9.",
        "answer": "1/9"
      },
      {
        "prompt": "Trong 30 học sinh, có 18 bạn thích Toán, 15 bạn thích Lý, 8 bạn thích cả hai môn. Hỏi có bao nhiêu bạn không thích môn nào?",
        "solution": "Số bạn thích ít nhất 1 môn = 18+15-8 = 25.\nSố bạn không thích môn nào = 30-25 = 5.",
        "answer": "5"
      }
    ],
    "quiz": [
      {
        "prompt": "Gieo 1 xúc xắc, xác suất ra mặt 6 chấm là?",
        "options": [
          "1/6",
          "1/2",
          "1/3",
          "6"
        ],
        "correct": 0,
        "explain": "1 kết quả thuận lợi trong 6 kết quả có thể."
      },
      {
        "prompt": "Biến cố chắc chắn có xác suất bằng?",
        "options": [
          "0",
          "0,5",
          "1",
          "Không xác định"
        ],
        "correct": 2,
        "explain": "Biến cố chắc chắn luôn xảy ra nên P=1."
      },
      {
        "prompt": "Hộp có 3 bi đỏ, 2 bi xanh. Xác suất lấy được bi đỏ?",
        "options": [
          "3/5",
          "2/5",
          "3/2",
          "1/5"
        ],
        "correct": 0,
        "explain": "3 bi đỏ trong tổng 5 bi: 3/5."
      },
      {
        "prompt": "Biểu đồ nào phù hợp thể hiện xu hướng thay đổi theo thời gian?",
        "options": [
          "Biểu đồ cột",
          "Biểu đồ đoạn thẳng",
          "Biểu đồ tranh",
          "Cả 3 đều được"
        ],
        "correct": 1,
        "explain": "Biểu đồ đoạn thẳng thể hiện rõ xu hướng tăng/giảm theo thời gian."
      }
    ]
  },
  {
    "id": "h1-duong-thang-song-song",
    "category": "hinh-hoc",
    "title": "Hai đường thẳng song song",
    "summary": "## Hai đường thẳng song song\n\n**Dấu hiệu nhận biết song song:** Nếu một đường thẳng cắt 2 đường thẳng khác và tạo ra 1 cặp góc so le trong bằng nhau (hoặc 1 cặp góc đồng vị bằng nhau) thì 2 đường thẳng đó song song.\n\n**Tính chất (chiều ngược lại):** Nếu 2 đường thẳng song song bị cắt bởi 1 đường thẳng thứ 3 thì: so le trong bằng nhau, đồng vị bằng nhau, trong cùng phía bù nhau.\n\n### Phương pháp chứng minh 2 đường thẳng song song\n1. Chỉ ra 1 cặp góc so le trong (hoặc đồng vị) bằng nhau.\n2. Chỉ ra cả 2 đường cùng vuông góc với 1 đường thẳng thứ 3.\n3. Chỉ ra cả 2 đường cùng song song với 1 đường thẳng thứ 3 (tính chất bắc cầu).\n\n**Kỹ thuật kẻ đường phụ song song:** Khi cần tính một góc phức tạp (ví dụ tổng nhiều góc không liền kề), kẻ thêm 1 đường thẳng đi qua đỉnh góc đó và song song với 1 đường đã có trong hình — kỹ thuật này giúp \"chuyển góc\" về vị trí so le trong/đồng vị dễ tính hơn.",
    "advanced": [
      {
        "prompt": "Cho 2 đường thẳng song song a, b bị cắt bởi đường thẳng c. Chứng minh 2 tia phân giác của 1 cặp góc so le trong song song với nhau.",
        "solution": "Vì a//b nên cặp góc so le trong bằng nhau.\nTia phân giác chia đôi mỗi góc bằng nhau đó thành 2 góc bằng nhau, nên các góc so le trong tạo bởi 2 tia phân giác cũng bằng nhau.\nVậy 2 tia phân giác song song với nhau.",
        "answer": "Đã chứng minh"
      },
      {
        "prompt": "Cho góc AOB=140°, tia OC là phân giác. Vẽ OD sao cho góc AOD=30° (D nằm trong góc AOC). Tính góc DOC và góc DOB.",
        "solution": "Góc AOC = 140°/2 = 70°. DOC = AOC-AOD = 70°-30° = 40°.\nDOB = AOB-AOD = 140°-30° = 110°.",
        "answer": "DOC=40°, DOB=110°"
      },
      {
        "prompt": "Hai góc kề tạo bởi 2 đường thẳng cắt nhau là (3x+10)° và (2x+30)°. Tìm x.",
        "solution": "Hai góc kề bù có tổng 180°: (3x+10)+(2x+30)=180 → 5x+40=180 → x=28.",
        "answer": "28"
      },
      {
        "prompt": "Cho 3 đường thẳng a, b, c đôi một song song. Khoảng cách giữa a và b là 3cm, giữa b và c là 5cm. Tính khoảng cách có thể có giữa a và c.",
        "solution": "TH b nằm giữa a,c: khoảng cách=3+5=8cm.\nTH b không nằm giữa: khoảng cách=5-3=2cm.\nVậy có 2 khả năng: 8cm hoặc 2cm.",
        "answer": "8cm hoặc 2cm"
      },
      {
        "prompt": "Tính tổng số đo tất cả các góc tạo bởi 1 đường thẳng cắt 2 đường thẳng song song (8 góc tại 2 giao điểm).",
        "solution": "Tại mỗi giao điểm có 4 góc, tổng=360°. Có 2 giao điểm.\nTổng tất cả 8 góc = 2×360° = 720°.",
        "answer": "720°"
      }
    ],
    "quiz": [
      {
        "prompt": "Hai góc so le trong bằng nhau thì 2 đường thẳng:",
        "options": [
          "Vuông góc",
          "Song song",
          "Cắt nhau",
          "Trùng nhau"
        ],
        "correct": 1,
        "explain": "Đây là dấu hiệu nhận biết 2 đường thẳng song song."
      },
      {
        "prompt": "Hai đường thẳng song song bị cắt bởi 1 cát tuyến, các góc đồng vị:",
        "options": [
          "Bằng nhau",
          "Bù nhau",
          "Phụ nhau",
          "Không liên quan"
        ],
        "correct": 0,
        "explain": "Tính chất của 2 đường thẳng song song."
      },
      {
        "prompt": "Hai góc trong cùng phía (2 đường song song) có tổng bằng?",
        "options": [
          "90°",
          "180°",
          "360°",
          "60°"
        ],
        "correct": 1,
        "explain": "Trong cùng phía thì bù nhau, tổng =180°."
      },
      {
        "prompt": "Qua 1 điểm ngoài đường thẳng, có bao nhiêu đường thẳng song song với đường đó?",
        "options": [
          "0",
          "1",
          "2",
          "Vô số"
        ],
        "correct": 1,
        "explain": "Tiên đề Euclid: chỉ có duy nhất 1 đường song song."
      }
    ]
  },
  {
    "id": "h2-tong-ba-goc",
    "category": "hinh-hoc",
    "title": "Tổng ba góc tam giác — Góc ngoài",
    "summary": "## Tổng ba góc tam giác — Góc ngoài\n\n**Tổng 3 góc trong tam giác:** luôn bằng 180°.\n\n**Góc ngoài của tam giác** (tại 1 đỉnh): là góc kề bù với góc trong tại đỉnh đó. Tính chất quan trọng nhất:\n\n**Góc ngoài = tổng 2 góc trong không kề với nó**\n\n### Phương pháp\n- Dùng tính chất góc ngoài để **tính nhanh** mà không cần đi vòng qua \"tổng 3 góc = 180°\" — đặc biệt hữu ích khi bài toán cho sẵn 2 góc trong không kề và hỏi về góc ngoài (hoặc ngược lại).\n- Với bài toán liên quan tổng nhiều góc trong hình phức tạp (đa giác lồi, hình có nhiều tam giác lồng nhau), kỹ thuật thường dùng là **tách hình thành các tam giác nhỏ** rồi cộng tổng góc từng tam giác, hoặc dùng liên tiếp tính chất góc ngoài để \"truyền\" góc từ tam giác này sang tam giác khác.",
    "advanced": [
      {
        "prompt": "Tam giác ABC có góc A=50°, góc B=60°. Tính góc ngoài tại đỉnh C.",
        "solution": "Góc C = 180°-50°-60° = 70°.\nGóc ngoài tại C = 180°-70° = 110° (cũng chính bằng góc A+góc B = 110°, khớp với tính chất góc ngoài).",
        "answer": "110°"
      },
      {
        "prompt": "Tam giác ABC vuông tại A, góc B=35°. Tính góc ngoài tại đỉnh C.",
        "solution": "Góc C = 90°-35° = 55°.\nGóc ngoài tại C = 180°-55° = 125° (= góc A+góc B = 90°+35°=125°, khớp).",
        "answer": "125°"
      },
      {
        "prompt": "Một tam giác có 3 góc tỉ lệ với 2:3:4. Tính mỗi góc.",
        "solution": "Tổng phần = 2+3+4=9. Mỗi phần = 180°/9=20°.\nBa góc: 40°, 60°, 80°.",
        "answer": "40°, 60°, 80°"
      },
      {
        "prompt": "Cho tam giác ABC, góc ngoài tại B bằng 130°, góc ngoài tại C bằng 110°. Tính 3 góc trong của tam giác.",
        "solution": "Góc B = 180°-130°=50°. Góc C = 180°-110°=70°.\nGóc A = 180°-50°-70°=60°.",
        "answer": "góc A=60°, góc B=50°, góc C=70°"
      },
      {
        "prompt": "Cho tam giác ABC, tia phân giác của góc ngoài tại A. Biết góc B=40°, góc C=60°. Tính góc ngoài tại A.",
        "solution": "Góc A = 180°-40°-60°=80°.\nGóc ngoài tại A = 180°-80°=100° (= góc B+góc C = 100°, khớp).",
        "answer": "100°"
      }
    ],
    "quiz": [
      {
        "prompt": "Tổng 3 góc trong 1 tam giác bằng?",
        "options": [
          "90°",
          "180°",
          "270°",
          "360°"
        ],
        "correct": 1,
        "explain": "Đây là định lý cơ bản của tam giác."
      },
      {
        "prompt": "Tam giác có góc A=90°, góc B=45°. Góc C bằng?",
        "options": [
          "30°",
          "45°",
          "60°",
          "90°"
        ],
        "correct": 1,
        "explain": "Góc C=180-90-45=45°."
      },
      {
        "prompt": "Góc ngoài của tam giác bằng tổng:",
        "options": [
          "2 góc trong kề nó",
          "2 góc trong không kề nó",
          "3 góc trong",
          "1 góc trong bất kỳ"
        ],
        "correct": 1,
        "explain": "Tính chất góc ngoài của tam giác."
      },
      {
        "prompt": "Tam giác có góc A=50°, góc B=70°. Góc ngoài tại đỉnh C bằng?",
        "options": [
          "60°",
          "120°",
          "110°",
          "130°"
        ],
        "correct": 1,
        "explain": "Góc C=180-50-70=60°, góc ngoài=180-60=120° (=A+B)."
      }
    ]
  },
  {
    "id": "h3-tam-giac-bang-nhau",
    "category": "hinh-hoc",
    "title": "Hai tam giác bằng nhau",
    "summary": "## Hai tam giác bằng nhau\n\n**Ba trường hợp bằng nhau của 2 tam giác:**\n- **c.c.c** (cạnh–cạnh–cạnh): 3 cặp cạnh tương ứng bằng nhau.\n- **c.g.c** (cạnh–góc–cạnh): 2 cặp cạnh và góc xen giữa tương ứng bằng nhau.\n- **g.c.g** (góc–cạnh–góc): 2 cặp góc và cạnh xen giữa tương ứng bằng nhau.\n\n### Phương pháp chứng minh 2 đoạn thẳng (hoặc 2 góc) bằng nhau\n**Đây là kỹ thuật quan trọng nhất của chuyên đề:** để chứng minh 2 đoạn thẳng (hoặc 2 góc) bằng nhau, ta tìm hoặc **dựng thêm đường phụ** để tạo ra 2 tam giác chứa 2 đoạn thẳng (góc) đó là 2 cạnh (góc) tương ứng, rồi chứng minh 2 tam giác này bằng nhau theo 1 trong 3 trường hợp trên.\n\n**Các đường phụ thường vẽ:** nối 2 điểm, kẻ đường vuông góc, lấy trung điểm, kéo dài 1 đoạn thẳng, vẽ tia phân giác — chọn đường phụ sao cho tạo ra đúng cặp tam giác cần chứng minh bằng nhau.",
    "advanced": [
      {
        "prompt": "Cho tam giác ABC=DEF (đúng thứ tự đỉnh), góc A=50°, góc E=60°. Tính góc C.",
        "solution": "Vì 2 tam giác bằng nhau theo thứ tự A-D, B-E, C-F: góc B=góc E=60°.\nGóc C = 180°-50°-60° = 70°.",
        "answer": "70°"
      },
      {
        "prompt": "Cho đoạn thẳng AB, M là trung điểm. Trên đường vuông góc với AB tại M lấy điểm C bất kỳ (C≠M). Chứng minh CA=CB.",
        "solution": "Xét tam giác CMA và CMB: CM chung, góc CMA=góc CMB=90°, MA=MB (M trung điểm).\nSuy ra 2 tam giác bằng nhau (c.g.c) → CA=CB.",
        "answer": "Đã chứng minh (c.g.c)"
      },
      {
        "prompt": "Cho góc xOy, tia phân giác Ot. Trên Ot lấy M. Kẻ MA⊥Ox tại A, MB⊥Oy tại B. Chứng minh MA=MB.",
        "solution": "Xét tam giác OAM và OBM: OM chung, góc AOM=góc BOM (Ot là phân giác), góc OAM=góc OBM=90°.\nSuy ra 2 tam giác bằng nhau → MA=MB.",
        "answer": "Đã chứng minh"
      },
      {
        "prompt": "Tam giác ABC có AB=AC. M là trung điểm BC. Chứng minh AM là tia phân giác góc A.",
        "solution": "Xét tam giác ABM và ACM: AB=AC (gt), BM=CM (M trung điểm), AM chung.\nSuy ra 2 tam giác bằng nhau (c.c.c) → góc BAM=góc CAM → AM là phân giác góc A.",
        "answer": "Đã chứng minh (c.c.c)"
      },
      {
        "prompt": "Cho tam giác ABC=A'B'C'. Chu vi tam giác ABC là 30cm, AB=8cm, BC=12cm. Tính cạnh A'C'.",
        "solution": "AC = 30-8-12 = 10cm.\nVì 2 tam giác bằng nhau: A'C' = AC = 10cm.",
        "answer": "10cm"
      }
    ],
    "quiz": [
      {
        "prompt": "Hai tam giác bằng nhau theo trường hợp c.c.c cần:",
        "options": [
          "3 cạnh tương ứng bằng nhau",
          "3 góc tương ứng bằng nhau",
          "2 cạnh 1 góc",
          "1 cạnh 2 góc"
        ],
        "correct": 0,
        "explain": "c.c.c là cạnh-cạnh-cạnh."
      },
      {
        "prompt": "Trường hợp c.g.c cần góc:",
        "options": [
          "Bất kỳ",
          "Xen giữa 2 cạnh",
          "Đối diện cạnh lớn nhất",
          "Vuông"
        ],
        "correct": 1,
        "explain": "Góc phải nằm xen giữa 2 cạnh tương ứng."
      },
      {
        "prompt": "Hai tam giác bằng nhau thì có:",
        "options": [
          "Diện tích bằng nhau",
          "Chu vi bằng nhau",
          "Các cạnh, góc tương ứng bằng nhau",
          "Cả 3 đáp án trên"
        ],
        "correct": 3,
        "explain": "Tam giác bằng nhau kéo theo tất cả các yếu tố tương ứng bằng nhau."
      },
      {
        "prompt": "Trường hợp g.c.g cần:",
        "options": [
          "3 góc bằng nhau",
          "2 góc và cạnh xen giữa",
          "2 góc và cạnh bất kỳ",
          "1 góc 2 cạnh"
        ],
        "correct": 1,
        "explain": "g.c.g là góc-cạnh-góc, cạnh phải xen giữa 2 góc."
      }
    ]
  },
  {
    "id": "h4-tam-giac-can-deu",
    "category": "hinh-hoc",
    "title": "Tam giác cân — Tam giác đều",
    "summary": "## Tam giác cân — Tam giác đều\n\n**Tam giác cân** (2 cạnh bên bằng nhau) → 2 góc đáy bằng nhau (và ngược lại).\n\n**Tính chất \"4 đường trùng nhau\":** Trong tam giác cân, đường trung tuyến, đường cao, đường phân giác kẻ từ **đỉnh cân**, và đường trung trực của **cạnh đáy** đều là **cùng một đường thẳng**. Đây là tính chất được khai thác rất nhiều trong các bài toán chứng minh.\n\n**Tam giác đều** (3 cạnh bằng nhau) → 3 góc đều bằng 60°.\n\n**Dấu hiệu nhận biết tam giác đều:** tam giác cân có thêm 1 góc bằng 60°, hoặc tam giác có 2 góc bằng 60°.\n\n### Phương pháp\nKhi đề bài cho tam giác cân, luôn tận dụng tính chất \"4 đường trùng nhau\" ngay để rút ngắn lời giải (thay vì phải chứng minh riêng từng tính chất vuông góc, chia đôi góc...).",
    "advanced": [
      {
        "prompt": "Tam giác ABC cân tại A, góc B=50°. Tia phân giác của góc C cắt AB tại D. Tính góc ADC.",
        "solution": "Vì cân tại A: góc C=góc B=50°. Góc A=180°-50°-50°=80°.\nTia phân giác chia góc C: góc ACD=25°.\nGóc ADC=180°-80°-25°=75°.",
        "answer": "75°"
      },
      {
        "prompt": "Tam giác đều ABC, D là trung điểm BC. Tính góc BAD.",
        "solution": "Trong tam giác đều, AD vừa là trung tuyến vừa là phân giác góc A (tính chất 4 đường trùng nhau).\nGóc BAD = 60°/2 = 30°.",
        "answer": "30°"
      },
      {
        "prompt": "Tam giác ABC cân tại A, góc A=100°. Tính góc B, góc C.",
        "solution": "Góc B = góc C = (180°-100°)/2 = 40°.",
        "answer": "40°"
      },
      {
        "prompt": "Tam giác ABC cân tại A. Trên tia đối BC lấy D, trên tia đối CB lấy E sao cho BD=CE. Chứng minh tam giác ADE cân.",
        "solution": "AB=AC (gt cân). Góc ABD=góc ACE (kề bù với 2 góc đáy bằng nhau ABC=ACB).\nXét tam giác ABD và ACE: AB=AC, góc ABD=góc ACE, BD=CE → 2 tam giác bằng nhau (c.g.c) → AD=AE.\nVậy tam giác ADE cân tại A.",
        "answer": "Đã chứng minh (cân tại A)"
      },
      {
        "prompt": "Tam giác đều ABC cạnh a. M, N, P lần lượt là trung điểm AB, BC, CA. Tam giác MNP là hình gì?",
        "solution": "MN, NP, PM đều là đường trung bình, mỗi đoạn bằng nửa cạnh đối diện = a/2.\nVì cả 3 cạnh bằng nhau, tam giác MNP đều.",
        "answer": "Tam giác đều"
      }
    ],
    "quiz": [
      {
        "prompt": "Tam giác cân có 2 cạnh bên bằng nhau thì 2 góc đáy:",
        "options": [
          "Bằng nhau",
          "Bù nhau",
          "Phụ nhau",
          "Không liên quan"
        ],
        "correct": 0,
        "explain": "Tính chất cơ bản của tam giác cân."
      },
      {
        "prompt": "Tam giác đều có mỗi góc bằng?",
        "options": [
          "45°",
          "60°",
          "90°",
          "120°"
        ],
        "correct": 1,
        "explain": "180°:3=60°."
      },
      {
        "prompt": "Tam giác cân có góc ở đỉnh 80°, mỗi góc đáy bằng?",
        "options": [
          "40°",
          "50°",
          "60°",
          "100°"
        ],
        "correct": 1,
        "explain": "(180-80)/2=50°."
      },
      {
        "prompt": "Trong tam giác cân, đường trung tuyến từ đỉnh cân đồng thời là:",
        "options": [
          "Chỉ đường cao",
          "Chỉ đường phân giác",
          "Đường cao và phân giác",
          "Không có tính chất đặc biệt"
        ],
        "correct": 2,
        "explain": "Tính chất '4 đường trùng nhau' của tam giác cân."
      }
    ]
  },
  {
    "id": "h5-pythagore",
    "category": "hinh-hoc",
    "title": "Định lý Pythagore",
    "summary": "## Định lý Pythagore\n\n**Định lý thuận:** Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương 2 cạnh góc vuông:\n\n**a² = b² + c²** (a là cạnh huyền)\n\n**Định lý đảo:** Nếu 1 tam giác có bình phương 1 cạnh bằng tổng bình phương 2 cạnh còn lại thì tam giác đó vuông tại góc đối diện cạnh lớn nhất.\n\n### Phương pháp\n- Dùng định lý thuận để **tính cạnh còn lại** khi biết 2 cạnh của tam giác vuông.\n- Dùng định lý đảo để **kiểm tra 1 tam giác có vuông hay không** khi biết độ dài 3 cạnh.\n- **Kỹ thuật kẻ đường cao/đường phụ vuông góc:** với các hình không phải tam giác vuông sẵn, kẻ thêm đường cao để tạo ra tam giác vuông rồi áp dụng định lý — đây là kỹ thuật dùng rất nhiều trong các bài toán tính độ dài phức tạp (ví dụ tính đường chéo hình thang, khoảng cách trong hình không gian đơn giản).",
    "advanced": [
      {
        "prompt": "Tam giác ABC có a=6, b=8, c=10. Chứng minh tam giác vuông và tìm góc vuông.",
        "solution": "Kiểm tra: a²+b²=36+64=100=c².\nVậy tam giác vuông tại C (góc đối diện cạnh c=10).",
        "answer": "Vuông tại C"
      },
      {
        "prompt": "Tam giác vuông có 2 cạnh góc vuông 9cm và 12cm. Tính cạnh huyền.",
        "solution": "Cạnh huyền = √(9²+12²) = √(81+144) = √225 = 15cm.",
        "answer": "15cm"
      },
      {
        "prompt": "Một chiếc thang dài 5m dựa vào tường, chân thang cách tường 3m. Hỏi thang cao tới đâu trên tường?",
        "solution": "Chiều cao = √(5²-3²) = √(25-9) = √16 = 4m.",
        "answer": "4m"
      },
      {
        "prompt": "Tam giác vuông cân có cạnh huyền 8cm. Tính độ dài cạnh góc vuông.",
        "solution": "Gọi cạnh góc vuông=x: x²+x²=64 → 2x²=64 → x²=32 → x=√32=4√2cm.",
        "answer": "4√2cm"
      },
      {
        "prompt": "Tam giác ABC vuông tại A, AB=6cm, BC=10cm. Tính chu vi tam giác.",
        "solution": "AC=√(BC²-AB²)=√(100-36)=√64=8cm.\nChu vi = 6+8+10 = 24cm.",
        "answer": "24cm"
      }
    ],
    "quiz": [
      {
        "prompt": "Tam giác vuông có 2 cạnh góc vuông 3 và 4. Cạnh huyền bằng?",
        "options": [
          "5",
          "7",
          "12",
          "25"
        ],
        "correct": 0,
        "explain": "√(9+16)=√25=5."
      },
      {
        "prompt": "Định lý Pythagore áp dụng cho tam giác:",
        "options": [
          "Bất kỳ",
          "Cân",
          "Vuông",
          "Đều"
        ],
        "correct": 2,
        "explain": "Chỉ áp dụng cho tam giác vuông."
      },
      {
        "prompt": "Tam giác có 3 cạnh 6, 8, 10 là tam giác:",
        "options": [
          "Vuông",
          "Cân",
          "Đều",
          "Không xác định"
        ],
        "correct": 0,
        "explain": "6²+8²=36+64=100=10², thỏa định lý Pythagore đảo."
      },
      {
        "prompt": "Tam giác vuông cân có cạnh góc vuông=5. Cạnh huyền xấp xỉ?",
        "options": [
          "5",
          "7,07",
          "10",
          "25"
        ],
        "correct": 1,
        "explain": "5√2≈7,07."
      }
    ]
  },
  {
    "id": "h6-quan-he-goc-canh",
    "category": "hinh-hoc",
    "title": "Quan hệ góc–cạnh — Bất đẳng thức tam giác",
    "summary": "## Quan hệ góc–cạnh — Bất đẳng thức tam giác\n\n**Quan hệ giữa góc và cạnh đối diện:** Trong 1 tam giác, cạnh đối diện với góc lớn hơn thì lớn hơn (và ngược lại — góc đối diện cạnh lớn hơn thì lớn hơn).\n\n**Bất đẳng thức tam giác:** Với 3 cạnh a, b, c của 1 tam giác:\n\n**|b − c| < a < b + c**\n\n(mỗi cạnh nhỏ hơn tổng 2 cạnh kia, lớn hơn hiệu 2 cạnh kia)\n\n### Phương pháp\n- Để **so sánh các góc** trong 1 tam giác khi biết độ dài các cạnh (hoặc ngược lại), luôn quy về so sánh trực tiếp các cạnh/góc đối diện tương ứng.\n- Để **tìm điều kiện của 1 cạnh chưa biết** (hoặc đếm số giá trị nguyên có thể), dùng bất đẳng thức tam giác để lập khoảng giá trị, sau đó áp thêm các điều kiện phụ (nguyên, chẵn/lẻ...) nếu có.",
    "advanced": [
      {
        "prompt": "Tam giác ABC có góc A=50°, góc B=60°. So sánh 3 cạnh AB, BC, CA.",
        "solution": "Góc C=70° (lớn nhất) → cạnh AB (đối diện C) lớn nhất.\nGóc A nhỏ nhất → cạnh BC (đối diện A) nhỏ nhất.\nVậy BC<CA<AB.",
        "answer": "BC<CA<AB"
      },
      {
        "prompt": "Tam giác ABC vuông tại A, AB<AC. So sánh góc B và góc C.",
        "solution": "Cạnh AB<AC, góc C đối diện AB, góc B đối diện AC.\nCạnh nhỏ hơn thì góc đối diện nhỏ hơn: góc C<góc B.",
        "answer": "góc C < góc B"
      },
      {
        "prompt": "Ba đoạn thẳng x, x+2, x+4 (x>0) tạo thành 1 tam giác. Tìm điều kiện của x.",
        "solution": "Cạnh lớn nhất (x+4) phải nhỏ hơn tổng 2 cạnh kia: x+4<x+(x+2) → x>2.",
        "answer": "x>2"
      },
      {
        "prompt": "Tam giác cân ABC (AB=AC) có góc đáy B=70°. So sánh cạnh AB với BC.",
        "solution": "Góc A=180°-70°-70°=40° (nhỏ nhất).\nCạnh đối diện góc nhỏ nhất là BC → BC nhỏ nhất, tức BC<AB.",
        "answer": "BC < AB"
      },
      {
        "prompt": "Tam giác ABC có AB=7cm, AC=9cm, BC=x (x nguyên, lẻ). Tìm giá trị lớn nhất của x.",
        "solution": "Theo bất đẳng thức tam giác: |9-7|<x<9+7, tức 2<x<16.\nSố nguyên lẻ lớn nhất thỏa mãn: x=15.",
        "answer": "15"
      }
    ],
    "quiz": [
      {
        "prompt": "Trong tam giác, cạnh đối diện góc lớn hơn thì:",
        "options": [
          "Nhỏ hơn",
          "Lớn hơn",
          "Bằng nhau",
          "Không liên quan"
        ],
        "correct": 1,
        "explain": "Quan hệ giữa góc và cạnh đối diện."
      },
      {
        "prompt": "3 đoạn thẳng 3, 4, 8 có tạo thành tam giác không?",
        "options": [
          "Có",
          "Không",
          "Chưa đủ dữ kiện",
          "Luôn tạo thành"
        ],
        "correct": 1,
        "explain": "3+4=7<8, không thỏa bất đẳng thức tam giác."
      },
      {
        "prompt": "Tam giác có góc A lớn nhất thì cạnh nào lớn nhất?",
        "options": [
          "Cạnh AB",
          "Cạnh AC",
          "Cạnh BC (đối diện A)",
          "Không xác định"
        ],
        "correct": 2,
        "explain": "Cạnh đối diện góc lớn nhất thì lớn nhất."
      },
      {
        "prompt": "Theo bất đẳng thức tam giác, cạnh a luôn thỏa:",
        "options": [
          "a<b+c",
          "a>b+c",
          "a=b+c",
          "a<b-c"
        ],
        "correct": 0,
        "explain": "Mỗi cạnh luôn nhỏ hơn tổng 2 cạnh còn lại."
      }
    ]
  },
  {
    "id": "h7-duong-dong-quy",
    "category": "hinh-hoc",
    "title": "Các đường đồng quy trong tam giác",
    "summary": "## Các đường đồng quy trong tam giác\n\n| Loại đường | Điểm đồng quy | Tính chất chính |\n|---|---|---|\n| 3 đường trung tuyến | **Trọng tâm G** | Cách mỗi đỉnh bằng 2/3 độ dài trung tuyến ứng với đỉnh đó |\n| 3 đường phân giác | **Tâm nội tiếp** | Cách đều 3 cạnh (bán kính đường tròn nội tiếp) |\n| 3 đường trung trực | **Tâm ngoại tiếp** | Cách đều 3 đỉnh (bán kính đường tròn ngoại tiếp) |\n| 3 đường cao | **Trực tâm** | — |\n\n### Các trường hợp đặc biệt cần nhớ\n- **Tam giác vuông:** trực tâm trùng với đỉnh góc vuông (vì 2 cạnh góc vuông chính là 2 đường cao).\n- **Tam giác đều:** cả 4 điểm đặc biệt (trọng tâm, trực tâm, tâm nội tiếp, tâm ngoại tiếp) trùng nhau tại 1 điểm duy nhất.\n- **Tam giác cân:** cả 4 điểm đặc biệt đều nằm trên cùng 1 đường thẳng — chính là đường trung tuyến/cao/phân giác/trung trực xuất phát từ đỉnh cân (do tính chất \"4 đường trùng nhau\" của tam giác cân).",
    "advanced": [
      {
        "prompt": "Tam giác ABC có trung tuyến AM=9cm, trọng tâm G. Tính AG và GM.",
        "solution": "AG = 2/3×AM = 6cm.\nGM = 1/3×AM = 3cm.",
        "answer": "AG=6cm, GM=3cm"
      },
      {
        "prompt": "Tam giác ABC vuông tại A. Xác định vị trí trực tâm.",
        "solution": "Trực tâm trùng với đỉnh A, vì 2 cạnh góc vuông AB, AC chính là 2 đường cao của tam giác.",
        "answer": "Trùng đỉnh A"
      },
      {
        "prompt": "Tam giác đều cạnh a có đường trung tuyến dài a√3/2. Tính khoảng cách từ trọng tâm đến mỗi đỉnh (theo a).",
        "solution": "Khoảng cách từ trọng tâm đến đỉnh = 2/3 × (a√3/2) = a√3/3.",
        "answer": "a√3/3"
      },
      {
        "prompt": "Tam giác ABC có trọng tâm G, diện tích ABC=54cm². Tính diện tích tam giác GBC.",
        "solution": "3 tam giác nhỏ AGB, BGC, CGA có diện tích bằng nhau, mỗi phần = 1/3 diện tích ABC = 18cm².",
        "answer": "18cm²"
      },
      {
        "prompt": "Tam giác cân ABC (AB=AC). Giải thích vì sao trọng tâm, trực tâm, tâm nội tiếp, tâm ngoại tiếp đều nằm trên cùng 1 đường thẳng.",
        "solution": "Đường trung tuyến AM (M trung điểm BC) trong tam giác cân đồng thời là đường cao, phân giác, trung trực xuất phát từ A.\nDo đó cả 4 điểm đặc biệt (mỗi điểm đều nằm trên 1 trong các đường đi qua A) đều nằm trên đường thẳng AM.",
        "answer": "Vì đường trung tuyến từ A đồng thời là đường cao, phân giác, trung trực"
      }
    ],
    "quiz": [
      {
        "prompt": "3 đường trung tuyến đồng quy tại:",
        "options": [
          "Trực tâm",
          "Trọng tâm",
          "Tâm nội tiếp",
          "Tâm ngoại tiếp"
        ],
        "correct": 1,
        "explain": "Định nghĩa trọng tâm."
      },
      {
        "prompt": "Trọng tâm cách mỗi đỉnh bằng bao nhiêu phần đường trung tuyến?",
        "options": [
          "1/2",
          "1/3",
          "2/3",
          "3/4"
        ],
        "correct": 2,
        "explain": "Tính chất trọng tâm: cách đỉnh 2/3 trung tuyến."
      },
      {
        "prompt": "3 đường cao đồng quy tại:",
        "options": [
          "Trọng tâm",
          "Trực tâm",
          "Tâm nội tiếp",
          "Tâm ngoại tiếp"
        ],
        "correct": 1,
        "explain": "Định nghĩa trực tâm."
      },
      {
        "prompt": "Trong tam giác vuông, trực tâm nằm ở đâu?",
        "options": [
          "Trung điểm cạnh huyền",
          "Đỉnh góc vuông",
          "Ngoài tam giác",
          "Trọng tâm"
        ],
        "correct": 1,
        "explain": "2 cạnh góc vuông chính là 2 đường cao, giao nhau tại đỉnh góc vuông."
      }
    ]
  },
  {
    "id": "h8-hinh-khoi",
    "category": "hinh-hoc",
    "title": "Một số hình khối trong thực tiễn",
    "summary": "## Một số hình khối trong thực tiễn\n\n**Hình hộp chữ nhật** (kích thước a, b, c):\n- Sxq = 2(a+b)×c\n- Stp = Sxq + 2ab\n- V = a×b×c\n\n**Hình lập phương** (cạnh a):\n- Sxq = 4a²; Stp = 6a²; V = a³\n\n**Hình lăng trụ đứng (tam giác, tứ giác):**\n- Sxq = chu vi đáy × chiều cao\n- Stp = Sxq + 2×diện tích đáy\n- V = diện tích đáy × chiều cao\n\n### Phương pháp\nVới các bài toán \"cắt khối lớn thành các khối nhỏ rồi đếm số mặt sơn\" — đây là dạng bài đặc trưng ở lớp chuyên. Chia các khối nhỏ theo vị trí: khối ở **góc** (3 mặt sơn), khối ở **cạnh** (2 mặt sơn), khối ở **mặt** (1 mặt sơn), khối **bên trong** (không mặt nào sơn) — rồi đếm số lượng mỗi loại theo kích thước khối lớn.",
    "advanced": [
      {
        "prompt": "Một khối gỗ lập phương cạnh 10cm được sơn đỏ toàn bộ mặt ngoài, sau đó cắt thành các khối lập phương nhỏ cạnh 1cm. Hỏi có bao nhiêu khối nhỏ có đúng 2 mặt được sơn đỏ?",
        "solution": "Các khối có đúng 2 mặt sơn nằm dọc theo các cạnh (trừ 2 đầu là góc).\n12 cạnh, mỗi cạnh có 10-2=8 khối thỏa mãn.\nTổng = 12×8 = 96 khối.",
        "answer": "96 khối"
      },
      {
        "prompt": "Một hình lập phương có tổng độ dài tất cả các cạnh là 96cm. Tính thể tích.",
        "solution": "Hình lập phương có 12 cạnh bằng nhau: cạnh = 96/12 = 8cm.\nThể tích = 8³ = 512cm³.",
        "answer": "512cm³"
      },
      {
        "prompt": "Một bể nước hình hộp chữ nhật dài 2m, rộng 1,5m, cao 1m, chứa đầy nước. Múc ra 1200 lít. Hỏi mực nước còn lại cao bao nhiêu?",
        "solution": "Thể tích bể = 2×1,5×1 = 3m³ = 3000 lít. Còn lại = 3000-1200 = 1800 lít = 1,8m³.\nDiện tích đáy = 3m². Chiều cao còn lại = 1,8/3 = 0,6m.",
        "answer": "0,6m"
      },
      {
        "prompt": "Hai hình lập phương có cạnh lần lượt là 3cm và 6cm. Tính tỉ số thể tích của chúng.",
        "solution": "Tỉ số thể tích = (tỉ số cạnh)³ = (3/6)³ = 1/8.",
        "answer": "1/8"
      },
      {
        "prompt": "Một khối gỗ hình hộp chữ nhật 6cm×4cm×5cm được sơn toàn bộ mặt ngoài rồi cắt thành khối lập phương nhỏ cạnh 1cm. Hỏi có bao nhiêu khối không có mặt nào được sơn?",
        "solution": "Khối không mặt nào sơn nằm hoàn toàn bên trong, kích thước (6-2)×(4-2)×(5-2) = 4×2×3 = 24 khối.",
        "answer": "24 khối"
      }
    ],
    "quiz": [
      {
        "prompt": "Thể tích hình lập phương cạnh a là?",
        "options": [
          "a²",
          "a³",
          "4a²",
          "6a²"
        ],
        "correct": 1,
        "explain": "V=a×a×a=a³."
      },
      {
        "prompt": "Diện tích toàn phần hình lập phương cạnh a là?",
        "options": [
          "a³",
          "4a²",
          "6a²",
          "a²"
        ],
        "correct": 2,
        "explain": "6 mặt, mỗi mặt diện tích a²: Stp=6a²."
      },
      {
        "prompt": "Hình hộp chữ nhật kích thước 2×3×4, thể tích bằng?",
        "options": [
          "9",
          "24",
          "20",
          "12"
        ],
        "correct": 1,
        "explain": "V=2×3×4=24."
      },
      {
        "prompt": "Diện tích xung quanh hình hộp chữ nhật bằng?",
        "options": [
          "Chu vi đáy × cao",
          "Diện tích đáy × cao",
          "2×diện tích đáy",
          "Chu vi đáy × 2"
        ],
        "correct": 0,
        "explain": "Công thức Sxq = chu vi đáy × chiều cao."
      }
    ]
  }
];

// Render markdown đơn giản: ## heading, **bold**, - list, | table |
function renderSummary(md) {
  const lines = md.split("\n");
  const blocks = [];
  let listBuf = [];
  let tableBuf = [];

  const flushList = () => {
    if (listBuf.length) {
      blocks.push(<ul key={blocks.length}>{listBuf.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}</ul>);
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      const rows = tableBuf.filter((r) => !/^\|?\s*-+\s*\|/.test(r));
      const cells = rows.map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const [head, ...body] = cells;
      blocks.push(
        <table key={blocks.length}>
          <thead><tr>{head.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />)}</tr></thead>
          <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: c.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />)}</tr>)}</tbody>
        </table>
      );
      tableBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); flushTable(); continue; }
    if (line.startsWith("|")) {
      flushList();
      tableBuf.push(line);
      continue;
    }
    flushTable();
    const bolded = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      listBuf.push(bolded.slice(2));
    } else {
      flushList();
      blocks.push(<p key={blocks.length} dangerouslySetInnerHTML={{ __html: bolded }} />);
    }
  }
  flushList();
  flushTable();
  return blocks;
}

function TopicSummary({ topic, accent, onExit, onGoAdvanced }) {
  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#7A6F60" }}>{topic.title} · Tóm tắt kiến thức</span>
          <button onClick={onExit} style={{ background: "none", border: "none", color: "#7A6F60", fontSize: 13, cursor: "pointer" }}>← Thoát ra</button>
        </div>
        <div style={{ background: "#fff", border: `1px solid #E4DCC8`, borderLeft: `4px solid ${accent}`, borderRadius: 3, padding: "24px 28px", marginBottom: 20 }} className="lt-summary">
          {renderSummary(topic.summary)}
        </div>
        <button onClick={onGoAdvanced} style={{ padding: "11px 24px", borderRadius: 3, border: `1.5px solid #8B5CF6`, background: "#8B5CF6", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          ★ Làm bài tập nâng cao ({topic.advanced.length} bài) →
        </button>
      </div>
    </div>
  );
}

function AdvancedPractice({ topic, accent, onExit }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [revealed, setRevealed] = useState({});
  const [drafts, setDrafts] = useState({});
  const [results, setResults] = useState({});

  const items = topic.advanced;
  const storageKey = `ct7-results-${topic.id}`;

  useEffect(() => {
    let saved = {};
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) saved = JSON.parse(raw);
    } catch (err) { saved = {}; }
    setResults(saved);
    const draftInit = {};
    Object.keys(saved).forEach((idx) => { draftInit[idx] = saved[idx].given; });
    setDrafts(draftInit);
    setRevealed({});
  }, [storageKey]);

  function tryUnlock(e) {
    e.preventDefault();
    if (pwInput === SOLUTION_PASSWORD) { setUnlocked(true); setPwError(""); }
    else setPwError("Mật khẩu không đúng, thử lại nhé.");
  }

  function toggleReveal(idx) { setRevealed((r) => ({ ...r, [idx]: !r[idx] })); }

  function submitAnswer(idx) {
    const given = drafts[idx] || "";
    const correct = checkAnswer(given, items[idx].answer);
    const next = { ...results, [idx]: { given, correct } };
    setResults(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch (err) {}
  }

  const answeredCount = Object.values(results).filter((r) => r && r.correct !== null).length;
  const correctCount = Object.values(results).filter((r) => r && r.correct === true).length;

  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 24px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#7A6F60" }}>{topic.title} · ★ Bài tập nâng cao</span>
          <button onClick={onExit} style={{ background: "none", border: "none", color: "#7A6F60", fontSize: 13, cursor: "pointer" }}>← Thoát ra</button>
        </div>
        <p style={{ fontSize: 13, color: "#9C9080", marginBottom: 18 }}>
          Đã làm {answeredCount}/{items.length} câu — đúng {correctCount} câu. Kết quả tự động lưu lại trên máy này.
        </p>
        {!unlocked && (
          <form onSubmit={tryUnlock} style={{ background: "#fff", border: "1px solid #D9CFC0", borderRadius: 3, padding: "16px 18px", marginBottom: 22 }}>
            <p style={{ fontSize: 14, color: "#4A4238", marginBottom: 10 }}>Con có thể tự làm và kiểm tra đáp số ngay bên dưới. Nhập mật khẩu để mở khóa xem lời giải chi tiết từng bước.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="password" value={pwInput} onChange={(e) => { setPwInput(e.target.value); setPwError(""); }} placeholder="Mật khẩu" style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${pwError ? marginRed : "#D9CFC0"}`, borderRadius: 3, fontSize: 14 }} />
              <button type="submit" style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mở khóa</button>
            </div>
            {pwError && <p style={{ color: marginRed, fontSize: 12, marginTop: 6 }}>{pwError}</p>}
          </form>
        )}
        <div className="flex flex-col gap-3">
          {items.map((ex, idx) => {
            const status = results[idx] ? results[idx].correct : null;
            const boxColor = status === true ? correctGreen : status === false ? marginRed : "#D9CFC0";
            const boxBg = status === true ? "#EAF4EC" : status === false ? "#FBEAE8" : "#fff";
            return (
              <div key={idx} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: `3px solid #8B5CF6`, borderRadius: 2, padding: "16px 18px" }}>
                <div style={{ fontSize: 13, color: "#9C9080", marginBottom: 6 }}>Bài {idx + 1}</div>
                <div className="lt-serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>{ex.prompt}</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#9C9080", display: "block", marginBottom: 4 }}>Đáp số của con</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" value={drafts[idx] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [idx]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitAnswer(idx); } }} placeholder="Nhập đáp số rồi bấm Kiểm tra..." style={{ flex: 1, padding: "10px 12px", border: `1.5px solid ${boxColor}`, background: boxBg, borderRadius: 3, fontSize: 14, color: inkColor, boxSizing: "border-box" }} />
                    <button onClick={() => submitAnswer(idx)} style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>Kiểm tra</button>
                  </div>
                  {status === true && <p style={{ color: correctGreen, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✓ Chính xác!</p>}
                  {status === false && <p style={{ color: marginRed, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✕ Chưa đúng — thử lại hoặc xem lời giải bên dưới.</p>}
                </div>
                {unlocked ? (
                  <>
                    <button onClick={() => toggleReveal(idx)} style={{ background: "none", border: "none", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                      {revealed[idx] ? "Ẩn lời giải ▲" : "Xem lời giải ▼"}
                    </button>
                    {revealed[idx] && (
                      <div style={{ marginTop: 10, padding: "12px 14px", background: "#FBF8F2", borderLeft: `3px solid #8B5CF6`, fontSize: 14, color: "#4A4238", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                        {ex.solution}
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: "#B5A98F" }}>Nhập mật khẩu ở trên để xem lời giải</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function Quiz({ topic, accent, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = topic.quiz[current];

  function pick(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 < topic.quiz.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="lt-page" style={{ minHeight: 280, padding: "40px 28px", borderRadius: 4, textAlign: "center" }}>
        <div className="lt-margin" />
        <h2 className="lt-serif" style={{ fontSize: 26, marginBottom: 10 }}>Kết quả: {score}/{topic.quiz.length}</h2>
        <p style={{ color: "#7A6F60", marginBottom: 24 }}>{topic.title}</p>
        <button onClick={onExit} style={{ padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="lt-page" style={{ minHeight: 360, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#7A6F60" }}>{topic.title} · Trắc nghiệm nhanh · Câu {current + 1}/{topic.quiz.length}</span>
          <button onClick={onExit} style={{ background: "none", border: "none", color: "#7A6F60", fontSize: 13, cursor: "pointer" }}>← Thoát ra</button>
        </div>
        <div className="lt-serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, marginBottom: 20 }}>{q.prompt}</div>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => {
            let bg = "#fff", border = "#D9CFC0", color = inkColor;
            if (answered) {
              if (idx === q.correct) { bg = "#EAF4EC"; border = correctGreen; color = correctGreen; }
              else if (idx === selected) { bg = "#FBEAE8"; border = marginRed; color = marginRed; }
            }
            return (
              <button key={idx} onClick={() => pick(idx)} style={{ textAlign: "left", padding: "12px 16px", borderRadius: 3, border: `1.5px solid ${border}`, background: bg, color, cursor: answered ? "default" : "pointer", fontSize: 15 }}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop: 16, padding: "12px 14px", background: "#FBF8F2", borderLeft: `3px solid ${accent}`, fontSize: 14, color: "#4A4238", lineHeight: 1.6 }}>
            {q.explain}
          </div>
        )}
        {answered && (
          <button onClick={next} style={{ marginTop: 18, padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {current + 1 < topic.quiz.length ? "Câu tiếp →" : "Xem kết quả"}
          </button>
        )}
      </div>
    </div>
  );
}

function TopicList({ topics, accent, onPickSummary, onPickQuiz, onPickAdvanced }) {
  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: 600, margin: "0 auto" }}>
      {topics.map((t, i) => (
        <div key={t.id} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: `4px solid ${accent}`, borderRadius: "2px", padding: "18px 22px" }}>
          <span style={{ fontSize: 12, color: "#9C9080" }}>Chuyên đề {i + 1}</span>
          <div className="lt-serif" style={{ fontSize: 18, fontWeight: 600, color: inkColor, marginTop: 2, marginBottom: 12 }}>{t.title}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => onPickSummary(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${accent}`, background: "transparent", color: accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              📖 Tóm tắt kiến thức
            </button>
            <button onClick={() => onPickQuiz(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Trắc nghiệm nhanh ({t.quiz.length})
            </button>
            <button onClick={() => onPickAdvanced(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid #8B5CF6`, background: "transparent", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ★ Nâng cao ({t.advanced.length})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("dai-so");
  const [view, setView] = useState(null); // { topic, mode: 'summary' | 'quiz' | 'advanced' }

  const cat = CATEGORIES.find((c) => c.id === category);
  const topics = CHUYEN_DE.filter((t) => t.category === category);

  function exit() { setView(null); }

  const totalQuiz = CHUYEN_DE.reduce((s, t) => s + t.quiz.length, 0);
  const totalAdv = CHUYEN_DE.reduce((s, t) => s + t.advanced.length, 0);

  return (
    <div className="lt-root" style={{ minHeight: "100%", padding: "28px 16px", background: "#F3EEE3" }}>
      {font}
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 className="lt-serif" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Toán 7 — Luyện tập tổng hợp</h1>
          <p style={{ fontSize: 14, color: "#7A6F60", marginTop: 6 }}>
            16 chuyên đề · Đại số &amp; Hình học · {totalQuiz} câu trắc nghiệm · {totalAdv} bài nâng cao
          </p>
        </div>

        {!view && (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="lt-tab"
                  style={{
                    padding: "10px 24px",
                    borderRadius: 4,
                    border: `2px solid ${c.color}`,
                    background: category === c.id ? c.color : "transparent",
                    color: category === c.id ? "#fff" : c.color,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {c.icon} {c.label} ({CHUYEN_DE.filter((t) => t.category === c.id).length})
                </button>
              ))}
            </div>
            <TopicList
              topics={topics}
              accent={cat.color}
              onPickSummary={(t) => setView({ topic: t, mode: "summary" })}
              onPickQuiz={(t) => setView({ topic: t, mode: "quiz" })}
              onPickAdvanced={(t) => setView({ topic: t, mode: "advanced" })}
            />
          </>
        )}

        {view && view.mode === "summary" && (
          <TopicSummary topic={view.topic} accent={cat.color} onExit={exit} onGoAdvanced={() => setView({ topic: view.topic, mode: "advanced" })} />
        )}
        {view && view.mode === "quiz" && (
          <Quiz topic={view.topic} accent={cat.color} onExit={exit} />
        )}
        {view && view.mode === "advanced" && (
          <AdvancedPractice topic={view.topic} accent={cat.color} onExit={exit} />
        )}
      </div>
    </div>
  );
}
