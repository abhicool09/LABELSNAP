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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
