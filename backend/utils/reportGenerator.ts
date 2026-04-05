import PDFDocument from 'pdfkit';
import type { Response } from 'express';

export const generateStartupReport = (data: any, res: Response) => {
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('upLIFT Analysis Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Summary
    doc.fontSize(18).text('Executive Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Overall Score: ${Math.round(data.overall_score * 100)}%`);
    doc.text(`Decision: ${data.decision}`);
    doc.text(`Confidence: ${Math.round(data.confidence_score * 100)}%`);
    doc.moveDown();

    // Metrics
    doc.fontSize(18).text('Score Breakdown', { underline: true });
    doc.moveDown(0.5);
    Object.entries(data.metrics).forEach(([key, metric]: [string, any]) => {
        doc.fontSize(14).text(`${key.toUpperCase()}: ${Math.round(metric.score * 100)}%`);
        metric.reasoning.forEach((r: string) => {
            doc.fontSize(10).text(`- ${r}`, { indent: 20 });
        });
        doc.moveDown(0.5);
    });

    // Comparison
    doc.moveDown();
    doc.fontSize(18).text('Market Comparison', { underline: true });
    doc.moveDown(0.5);
    data.comparison.similar_startups.forEach((s: any) => {
        doc.fontSize(12).text(`${s.name} (${s.industry}) - Outcome: ${s.status}`);
        doc.fontSize(10).text(`Similarity: ${Math.round(s.similarity * 100)}%`, { indent: 20 });
        doc.moveDown(0.3);
    });

    doc.end();
};
