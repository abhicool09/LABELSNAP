import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const FlipkartCrop = lazy(() => import('./pages/FlipkartCrop'));
const MeeshoCrop = lazy(() => import('./pages/MeeshoCrop'));
const MeeshoInvoiceCrop = lazy(() => import('./pages/MeeshoInvoiceCrop'));
const MeeshoCourierCrop = lazy(() => import('./pages/MeeshoCourierCrop'));
const MeeshoCourierInvoiceCrop = lazy(() => import('./pages/MeeshoCourierInvoiceCrop'));
const AmazonCrop = lazy(() => import('./pages/AmazonCrop'));
const ShippingLabelCropper = lazy(() => import('./pages/ShippingLabelCropper'));
const A4LabelPrint = lazy(() => import('./pages/A4LabelPrint'));
const MergePdf = lazy(() => import('./pages/MergePdf'));
const ToolsHub = lazy(() => import('./pages/ToolsHub'));
const QrGenerator = lazy(() => import('./pages/QrGenerator'));
const BarcodeGenerator = lazy(() => import('./pages/BarcodeGenerator'));
const LabelMaker = lazy(() => import('./pages/LabelMaker'));
const CheckoutComplete = lazy(() => import('./pages/CheckoutComplete'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flipkart" element={<FlipkartCrop />} />
          <Route path="/flipkart-label-cropper" element={<FlipkartCrop />} />
          <Route path="/flipkart-shipping-label-cropper" element={<FlipkartCrop />} />
          <Route path="/meesho" element={<MeeshoCrop />} />
          <Route path="/meesho-label-cropper" element={<MeeshoCrop />} />
          <Route path="/meesho-shipping-label-cropper" element={<MeeshoCrop />} />
          <Route path="/meesho-invoice" element={<MeeshoInvoiceCrop />} />
          <Route path="/meesho-label-cropper-with-invoice" element={<MeeshoInvoiceCrop />} />
          <Route path="/meesho-courier" element={<MeeshoCourierCrop />} />
          <Route path="/meesho-courier-label-cropper" element={<MeeshoCourierCrop />} />
          <Route path="/meesho-courier-invoice" element={<MeeshoCourierInvoiceCrop />} />
          <Route path="/meesho-courier-label-cropper-with-invoice" element={<MeeshoCourierInvoiceCrop />} />
          <Route path="/amazon" element={<AmazonCrop />} />
          <Route path="/amazon-label-cropper" element={<AmazonCrop />} />
          <Route path="/amazon-shipping-label-cropper" element={<AmazonCrop />} />
          <Route path="/shipping-label-cropper" element={<ShippingLabelCropper />} />
          <Route path="/4x6-label-print-a4" element={<A4LabelPrint />} />
          <Route path="/merge" element={<MergePdf />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/qr-code-generator" element={<QrGenerator />} />
          <Route path="/free-qr-code-generator" element={<QrGenerator />} />
          <Route path="/barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/free-barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/shipping-label-maker" element={<LabelMaker templateKey="shipping" />} />
          <Route path="/shipping-label" element={<LabelMaker templateKey="shipping" />} />
          <Route path="/product-label-maker" element={<LabelMaker templateKey="product" />} />
          <Route path="/product-label" element={<LabelMaker templateKey="product" />} />
          <Route path="/price-tag-maker" element={<LabelMaker templateKey="price" />} />
          <Route path="/price-label" element={<LabelMaker templateKey="price" />} />
          <Route path="/inventory-label-maker" element={<LabelMaker templateKey="inventory" />} />
          <Route path="/inventory-label" element={<LabelMaker templateKey="inventory" />} />
          <Route path="/address-label-maker" element={<LabelMaker templateKey="address" />} />
          <Route path="/address-label" element={<LabelMaker templateKey="address" />} />
          <Route path="/manufacturing-label-maker" element={<LabelMaker templateKey="manufacturing" />} />
          <Route path="/manufacturing-label" element={<LabelMaker templateKey="manufacturing" />} />
          <Route path="/custom-label-maker" element={<LabelMaker templateKey="custom" />} />
          <Route path="/custom-label" element={<LabelMaker templateKey="custom" />} />
          <Route path="/discount-label-maker" element={<LabelMaker templateKey="pricing" />} />
          <Route path="/pricing-label" element={<LabelMaker templateKey="pricing" />} />
          <Route path="/cable-label-maker" element={<LabelMaker templateKey="cable" />} />
          <Route path="/cable-label" element={<LabelMaker templateKey="cable" />} />
          <Route path="/jewelry-tag-maker" element={<LabelMaker templateKey="jewellery" />} />
          <Route path="/jewellery-label" element={<LabelMaker templateKey="jewellery" />} />
          <Route path="/thank-you-sticker-maker" element={<LabelMaker templateKey="thanks" />} />
          <Route path="/thank-you-label" element={<LabelMaker templateKey="thanks" />} />
          <Route path="/garment-label-maker" element={<LabelMaker templateKey="garment" />} />
          <Route path="/garment-label" element={<LabelMaker templateKey="garment" />} />
          <Route path="/qr-label" element={<QrGenerator />} />
          <Route path="/barcode-label" element={<BarcodeGenerator />} />
          <Route path="/generator" element={<ToolsHub />} />
          <Route path="/ai-label-studio" element={<ToolsHub />} />
          <Route path="/thermal-generator" element={<ToolsHub />} />
          <Route path="/checkout/complete" element={<CheckoutComplete />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
