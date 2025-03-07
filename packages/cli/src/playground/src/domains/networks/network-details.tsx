import { useNetwork } from '@/hooks/use-networks';
import { Badge } from '@/components/ui/badge';
import { Brain, Users } from 'lucide-react';

export function NetworkDetails({ networkId }: { networkId: string }) {
  const { network, isLoading } = useNetwork(networkId);

  if (isLoading || !network) {
    return (
      <div className="p-4">
        <p className="text-sm text-mastra-el-4">Loading network details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-mastra-el-5 mb-1">Network Name</h3>
        <p className="text-sm text-mastra-el-4">{network.name}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-mastra-el-5 mb-1">Routing Model</h3>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-mastra-el-4" />
          <Badge className="border-none text-xs">{network.routingModel?.modelId || 'Unknown'}</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-mastra-el-5 mb-1">Instructions</h3>
        <p className="text-sm text-mastra-el-4">{network.instructions || 'No instructions provided'}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-mastra-el-5 mb-1">Agents</h3>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-mastra-el-4" />
          <Badge variant="outline" className="text-xs">
            {network.agents?.length || 0} agents
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-mastra-el-5 mb-1">State</h3>
        <div className="p-3 rounded-md">
          <pre className="text-xs text-mastra-el-4 whitespace-pre-wrap overflow-auto max-h-48">
            {JSON.stringify(network.state || {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
