"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
const inventory_transaction_dto_1 = require("./dto/inventory-transaction.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async findAll(storeId, partId) {
        console.log('📦 [InventoryController] GET /inventory');
        if (storeId) {
            return this.inventoryService.findByStore(parseInt(storeId, 10));
        }
        if (partId) {
            return this.inventoryService.findByPart(parseInt(partId, 10));
        }
        return this.inventoryService.findAll();
    }
    async getInventoryByStore() {
        console.log('📦 [InventoryController] GET /inventory/by-store');
        return this.inventoryService.getInventoryByStore();
    }
    async getLedger(partId) {
        console.log('📦 [InventoryController] GET /inventory/ledger', partId ? `partId=${partId}` : '');
        if (partId)
            return this.inventoryService.findLedgerByPart(parseInt(partId, 10));
        return this.inventoryService.findLedger();
    }
    async findOne(id) {
        console.log(`📦 [InventoryController] GET /inventory/${id}`);
        return this.inventoryService.findOne(id);
    }
    async create(createInventoryDto) {
        console.log('📦 [InventoryController] POST /inventory');
        console.log('📦 [InventoryController] Create inventory data:', createInventoryDto);
        return this.inventoryService.create(createInventoryDto);
    }
    async recordTransaction(transactionDto) {
        console.log('📦 [InventoryController] POST /inventory/transaction');
        console.log('📦 [InventoryController] Transaction data:', transactionDto);
        return this.inventoryService.recordTransaction(transactionDto);
    }
    async update(id, updateInventoryDto) {
        console.log(`📦 [InventoryController] PUT /inventory/${id}`);
        console.log('📦 [InventoryController] Update inventory data:', updateInventoryDto);
        return this.inventoryService.update(id, updateInventoryDto);
    }
    async remove(id) {
        console.log(`📦 [InventoryController] DELETE /inventory/${id}`);
        await this.inventoryService.remove(id);
        return { message: 'Inventory record deleted successfully' };
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, common_1.Query)('partId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-store'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryByStore", null);
__decorate([
    (0, common_1.Get)('ledger'),
    __param(0, (0, common_1.Query)('partId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('transaction'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_transaction_dto_1.InventoryTransactionDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "recordTransaction", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map