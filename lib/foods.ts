// Danh sách món MẶC ĐỊNH — chỉ dùng để seed vào Redis lần đầu.
// Sau khi seed, danh sách thật được lưu/sửa trong Redis (xem lib/foodStore.ts).
export type Food = {
  name: string;
  image: string;
};

export const DEFAULT_FOODS: Food[] = [
  { name: "Phở bò", image: "https://loremflickr.com/800/600/pho,noodle?lock=1" },
  { name: "Bún chả", image: "https://loremflickr.com/800/600/grilled,pork,noodle?lock=2" },
  { name: "Cơm tấm sườn", image: "https://loremflickr.com/800/600/rice,pork,chop?lock=3" },
  { name: "Bánh mì thịt", image: "https://loremflickr.com/800/600/banhmi,sandwich?lock=4" },
  { name: "Bún bò Huế", image: "https://loremflickr.com/800/600/beef,noodle,soup?lock=5" },
  { name: "Cơm gà xối mỡ", image: "https://loremflickr.com/800/600/fried,chicken,rice?lock=6" },
  { name: "Mì Quảng", image: "https://loremflickr.com/800/600/turmeric,noodle?lock=7" },
  { name: "Hủ tiếu Nam Vang", image: "https://loremflickr.com/800/600/noodle,soup?lock=8" },
  { name: "Bún riêu cua", image: "https://loremflickr.com/800/600/crab,noodle,soup?lock=9" },
  { name: "Bánh canh cua", image: "https://loremflickr.com/800/600/crab,noodle?lock=10" },
  { name: "Cơm sườn trứng", image: "https://loremflickr.com/800/600/rice,egg,pork?lock=11" },
  { name: "Phở gà", image: "https://loremflickr.com/800/600/chicken,noodle,soup?lock=12" },
  { name: "Bún đậu mắm tôm", image: "https://loremflickr.com/800/600/tofu,noodle?lock=13" },
  { name: "Cơm chiên dương châu", image: "https://loremflickr.com/800/600/fried,rice?lock=14" },
  { name: "Lẩu Thái", image: "https://loremflickr.com/800/600/hotpot,thai?lock=15" },
  { name: "Pizza", image: "https://loremflickr.com/800/600/pizza?lock=16" },
  { name: "Gà rán", image: "https://loremflickr.com/800/600/fried,chicken?lock=17" },
  { name: "Bún thịt nướng", image: "https://loremflickr.com/800/600/grilled,pork,vermicelli?lock=18" },
];
