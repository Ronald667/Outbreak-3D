import React from 'react';
import { Hammer, X, Wrench, Package, Shield, Flame, Zap } from 'lucide-react';
import { CraftingRecipe, CraftingComponent } from '../types/game';
import { CRAFTING_RECIPES } from '../utils/gameConstants';
import { soundManager } from '../utils/audio';

interface CraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: Record<string, number>;
  onCraftItem: (recipe: CraftingRecipe) => void;
}

export const CraftingModal: React.FC<CraftingModalProps> = ({
  isOpen,
  onClose,
  components,
  onCraftItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Hammer className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Workbench & Crafting Station</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Component Inventory Bar */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Scavenged Components:</span>
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-slate-300">Scrap Metal:</span>
              <span className="font-bold text-white">{components.scrap || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
              <span className="text-slate-300">Wood:</span>
              <span className="font-bold text-white">{components.wood || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-slate-300">Wires:</span>
              <span className="font-bold text-white">{components.wire || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Explosives:</span>
              <span className="font-bold text-white">{components.explosives || 0}</span>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {CRAFTING_RECIPES.map((recipe) => {
            // Check if player has enough components
            let canCraft = true;
            Object.entries(recipe.cost).forEach(([mat, reqQty]) => {
              const available = components[mat] || 0;
              if (available < (reqQty as number)) {
                canCraft = false;
              }
            });

            return (
              <div
                key={recipe.id}
                className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-slate-600"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base">{recipe.name}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 uppercase tracking-wider font-mono">
                      {recipe.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{recipe.description}</p>

                  {/* Requirements */}
                  <div className="space-y-1.5 mb-4 bg-slate-950/40 p-3 rounded-lg">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Required Components</span>
                    <div className="flex flex-wrap gap-3 text-xs font-mono">
                      {Object.entries(recipe.cost).map(([mat, qty]) => {
                        const hasQty = (components[mat] || 0) >= (qty as number);
                        return (
                          <span
                            key={mat}
                            className={`px-2 py-1 rounded ${
                              hasQty ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {mat}: {components[mat] || 0} / {qty}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (canCraft) {
                      onCraftItem(recipe);
                      soundManager.playPerkJingle();
                    }
                  }}
                  disabled={!canCraft}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    canCraft
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canCraft ? 'Craft Item' : 'Missing Components'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
