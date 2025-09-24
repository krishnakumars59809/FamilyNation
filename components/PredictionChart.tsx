// components/PredictionChart.tsx
import { useEffect, useRef } from 'react';

interface PredictionData {
  stabilityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
  chartData?: {
    current: number;
    projected: number;
    risk?: number;
  };
}

interface PredictionChartProps {
  data: PredictionData;
}

export const PredictionChart = ({ data }: PredictionChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentStability = data.stabilityScore;
    const projectedStability =
      data.chartData?.projected || Math.min(100, currentStability + 25);
    const riskLevel = 100 - currentStability;

    // Colors from your style guide
    const colors = {
      current: '#1E3A8A', // Deep Blue
      projected: '#34D399', // Soft Green
      risk: '#F87171', // Soft Coral
      grid: '#E5E7EB',
      text: '#374151',
    };

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = 120;
    const barWidth = 60;
    const spacing = 40;

    // Draw grid lines
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 100; i += 25) {
      const y = padding + chartHeight - (i / 100) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Grid labels
      ctx.fillStyle = colors.text;
      ctx.font = '12px system-ui';
      ctx.fillText(`${i}%`, 10, y + 4);
    }

    // Draw current stability bar
    const currentX = padding + spacing;
    const currentHeight = (currentStability / 100) * chartHeight;
    ctx.fillStyle = colors.current;
    ctx.fillRect(
      currentX,
      padding + chartHeight - currentHeight,
      barWidth,
      currentHeight
    );

    // Draw projected stability bar
    const projectedX = currentX + barWidth + spacing;
    const projectedHeight = (projectedStability / 100) * chartHeight;
    ctx.fillStyle = colors.projected;
    ctx.fillRect(
      projectedX,
      padding + chartHeight - projectedHeight,
      barWidth,
      projectedHeight
    );

    // Draw risk bar
    const riskX = projectedX + barWidth + spacing;
    const riskHeight = (riskLevel / 100) * chartHeight;
    ctx.fillStyle = colors.risk;
    ctx.fillRect(
      riskX,
      padding + chartHeight - riskHeight,
      barWidth,
      riskHeight
    );

    // Draw labels
    ctx.fillStyle = colors.text;
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';

    ctx.fillText(
      'Current',
      currentX + barWidth / 2,
      padding + chartHeight + 20
    );
    ctx.fillText(
      'With Support',
      projectedX + barWidth / 2,
      padding + chartHeight + 20
    );
    ctx.fillText(
      'Risk Level',
      riskX + barWidth / 2,
      padding + chartHeight + 20
    );

    // Draw percentage values
    ctx.font = 'bold 16px system-ui';
    ctx.fillText(
      `${currentStability}%`,
      currentX + barWidth / 2,
      padding + chartHeight - currentHeight - 10
    );
    ctx.fillText(
      `${projectedStability}%`,
      projectedX + barWidth / 2,
      padding + chartHeight - projectedHeight - 10
    );
    ctx.fillText(
      `${riskLevel}%`,
      riskX + barWidth / 2,
      padding + chartHeight - riskHeight - 10
    );
  }, [data]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-auto max-w-full"
      />
      <div className="flex justify-center space-x-6 mt-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#1E3A8A] rounded"></div>
          <span>Current Stability</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#34D399] rounded"></div>
          <span>With Support</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#F87171] rounded"></div>
          <span>Risk Level</span>
        </div>
      </div>
    </div>
  );
};
