"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicLoader = exports.homeLoader = void 0;
const homeLoader = async (_settings) => {
    // Intentionally minimal: the dashboard + swagger are wired in expressLoader.
};
exports.homeLoader = homeLoader;
const publicLoader = async (_settings) => {
    // Static/public asset serving can be added here if needed.
};
exports.publicLoader = publicLoader;
//# sourceMappingURL=homeLoader.js.map