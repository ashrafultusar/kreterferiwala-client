
import AllCategories from "../components/AllCategories/AllCategories";
import AllProducts from "../components/HomePage/AllProducts/AllProducts";
import Slider from "../components/Slider/Slider";

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;

  const [slidersRes, categoriesRes, productsRes] = await Promise.all([
    fetch(`${baseUrl}/sliders`, { cache: "no-store" }),
    fetch(`${baseUrl}/categories`, { cache: "no-store" }),
    fetch(`${baseUrl}/products`, { cache: "no-store" }),
  ]);

  if (!slidersRes.ok || !categoriesRes.ok || !productsRes.ok) {
    throw new Error("Failed to fetch one or more APIs");
  }

  const [sliders, categories, products] = await Promise.all([
    slidersRes.json(),
    categoriesRes.json(),
    productsRes.json(),
  ]);

  return { sliders, categories, products };
}

export default async function Home() {
  const { sliders, categories, products } = await getData();

  return (
    <div className="flex flex-col min-h-screen mt-16 md:mt-40 lg:mt-32">
      <div className="w-full">
        <Slider data={sliders} />
      </div>
      <AllCategories data={categories} />
      <AllProducts data={products} />
    </div>
  );
}
