import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
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
const LabelStudio = lazy(() => import('./pages/LabelStudio'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
          <Route path="/flipkart" element={<Navigate to="/flipkart-label-cropper" replace />} />
          <Route path="/flipkart-label-cropper" element={<FlipkartCrop />} />
          <Route path="/flipkart-shipping-label-cropper" element={<Navigate to="/flipkart-label-cropper" replace />} />
          <Route path="/meesho" element={<Navigate to="/meesho-label-cropper" replace />} />
          <Route path="/meesho-label-cropper" element={<MeeshoCrop />} />
          <Route path="/meesho-shipping-label-cropper" element={<Navigate to="/meesho-label-cropper" replace />} />
          <Route path="/meesho-invoice" element={<Navigate to="/meesho-label-cropper-with-invoice" replace />} />
          <Route path="/meesho-label-cropper-with-invoice" element={<MeeshoInvoiceCrop />} />
          <Route path="/meesho-courier" element={<Navigate to="/meesho-courier-label-cropper" replace />} />
          <Route path="/meesho-courier-label-cropper" element={<MeeshoCourierCrop />} />
          <Route path="/meesho-courier-invoice" element={<Navigate to="/meesho-courier-label-cropper-with-invoice" replace />} />
          <Route path="/meesho-courier-label-cropper-with-invoice" element={<MeeshoCourierInvoiceCrop />} />
          <Route path="/amazon" element={<Navigate to="/amazon-label-cropper" replace />} />
          <Route path="/amazon-label-cropper" element={<AmazonCrop />} />
          <Route path="/amazon-shipping-label-cropper" element={<Navigate to="/amazon-label-cropper" replace />} />
          <Route path="/shipping-label-cropper" element={<ShippingLabelCropper />} />
          <Route path="/4x6-label-print-a4" element={<A4LabelPrint />} />
          <Route path="/merge" element={<MergePdf />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/qr-code-generator" element={<QrGenerator />} />
          <Route path="/free-qr-code-generator" element={<Navigate to="/qr-code-generator" replace />} />
          <Route path="/barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/free-barcode-generator" element={<Navigate to="/barcode-generator" replace />} />
          <Route path="/shipping-label-maker" element={<LabelMaker templateKey="shipping" />} />
          <Route path="/shipping-label" element={<Navigate to="/shipping-label-maker" replace />} />
          <Route path="/product-label-maker" element={<LabelMaker templateKey="product" />} />
          <Route path="/product-label" element={<Navigate to="/product-label-maker" replace />} />
          <Route path="/price-tag-maker" element={<LabelMaker templateKey="price" />} />
          <Route path="/price-label" element={<Navigate to="/price-tag-maker" replace />} />
          <Route path="/inventory-label-maker" element={<LabelMaker templateKey="inventory" />} />
          <Route path="/inventory-label" element={<Navigate to="/inventory-label-maker" replace />} />
          <Route path="/address-label-maker" element={<LabelMaker templateKey="address" />} />
          <Route path="/address-label" element={<Navigate to="/address-label-maker" replace />} />
          <Route path="/manufacturing-label-maker" element={<LabelMaker templateKey="manufacturing" />} />
          <Route path="/manufacturing-label" element={<Navigate to="/manufacturing-label-maker" replace />} />
          <Route path="/custom-label-maker" element={<LabelMaker templateKey="custom" />} />
          <Route path="/custom-label" element={<Navigate to="/custom-label-maker" replace />} />
          <Route path="/discount-label-maker" element={<LabelMaker templateKey="pricing" />} />
          <Route path="/pricing-label" element={<Navigate to="/discount-label-maker" replace />} />
          <Route path="/cable-label-maker" element={<LabelMaker templateKey="cable" />} />
          <Route path="/cable-label" element={<Navigate to="/cable-label-maker" replace />} />
          <Route path="/jewelry-tag-maker" element={<LabelMaker templateKey="jewellery" />} />
          <Route path="/jewellery-label" element={<Navigate to="/jewelry-tag-maker" replace />} />
          <Route path="/thank-you-sticker-maker" element={<LabelMaker templateKey="thanks" />} />
          <Route path="/thank-you-label" element={<Navigate to="/thank-you-sticker-maker" replace />} />
          <Route path="/garment-label-maker" element={<LabelMaker templateKey="garment" />} />
          <Route path="/garment-label" element={<Navigate to="/garment-label-maker" replace />} />
          <Route path="/qr-label" element={<Navigate to="/qr-code-generator" replace />} />
          <Route path="/barcode-label" element={<Navigate to="/barcode-generator" replace />} />
          <Route path="/generator" element={<Navigate to="/tools" replace />} />
          <Route path="/ai-label-studio" element={<LabelStudio />} />
          <Route path="/thermal-generator" element={<Navigate to="/tools" replace />} />
          <Route path="/checkout/complete" element={<CheckoutComplete />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
