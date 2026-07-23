import { Get, Authorized, JsonController, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import ExcelJS from "exceljs";
import { Logger, LoggerInterface } from "../../../decorators/Logger";
import { AmbassadorRepository } from "../../repositories/AmbassadorRepository";
import { resolveTier } from "../../models/ambassadors";

@Service()
@Authorized("admin")
@JsonController("/admin/reports")
export class ReportController {
    constructor(
        private ambassadorRepository: AmbassadorRepository,
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    /**
     * @openapi
     * /admin/reports/ambassadors/download:
     *   get:
     *     tags: [Admin / Reports]
     *     summary: Download the full Ambassador list as an Excel (.xlsx) file
     */
    @Get("/ambassadors/download")
    async downloadAmbassadors(@Res() res: Response): Promise<Response> {
        this.log.info("Generating ambassador Excel report");

        const ambassadors = await this.ambassadorRepository.repository.find({
            order: { rank: "ASC" },
        });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Gajab Admin";
        workbook.created = new Date();

        const sheet = workbook.addWorksheet("Ambassadors", {
            views: [{ state: "frozen", ySplit: 1 }],
        });

        sheet.columns = [
            { header: "ID", key: "id", width: 18 },
            { header: "Name", key: "name", width: 24 },
            { header: "Email", key: "email", width: 32 },
            { header: "Phone", key: "phone", width: 16 },
            { header: "College", key: "college", width: 30 },
            { header: "City", key: "city", width: 16 },
            { header: "State", key: "state", width: 16 },
            { header: "Tier", key: "tier", width: 12 },
            { header: "Rank", key: "rank", width: 8 },
            { header: "Commission %", key: "commissionPct", width: 14 },
            { header: "Revenue (₹)", key: "revenue", width: 16 },
            { header: "Orders", key: "orders", width: 10 },
            { header: "Joined On", key: "createdAt", width: 18 },
        ];

        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF26B1F" } };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.height = 20;

        for (const amb of ambassadors) {
            const { level } = resolveTier(Number(amb.revenue));
            sheet.addRow({
                id: amb.id,
                name: amb.name,
                email: amb.email,
                phone: amb.phone,
                college: amb.college,
                city: amb.city,
                state: amb.state,
                tier: level,
                rank: amb.rank,
                commissionPct: amb.commissionPct,
                revenue: Number(amb.revenue),
                orders: amb.orders,
                createdAt: amb.createdAt
                    ? new Date(amb.createdAt).toLocaleDateString("en-IN")
                    : "",
            });
        }

        // Alternate row shading
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: rowNumber % 2 === 0 ? "FFFFF7EE" : "FFFFFFFF" },
                };
                cell.border = {
                    bottom: { style: "thin", color: { argb: "FFEFEAE0" } },
                };
            });
        });

        const filename = `ambassadors-${new Date().toISOString().slice(0, 10)}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Cache-Control", "no-cache");

        await workbook.xlsx.write(res);

        this.log.info(`Ambassador report sent: ${ambassadors.length} rows`);
        return res;
    }
}
