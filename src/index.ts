// index.ts
import { Command } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { first } from "lodash";
import ora from "ora";
import net from "NeteaseCloudMusicApi";
import { Datum } from "../type";
import dayjs from "dayjs";
import inquirer from "inquirer";

const configPath = join(homedir(), ".netrc");
const program = new Command();
program
  .version("0.0.1")
  .option("-l, --login", "登陆")
  .option("-ls, --list", "云列表")
  .option("-up, --upload <path>", "文件上传")
  .option("-f, --folder", "目录文件批量上传")
  .option("-p, --page <page>", "当前页数, 默认 1")
  .option("-ps, --pageSize <pageSize>", "每页数据, 默认 10")

  .action(async (options) => {
    if (options.login) {
      ora().info("只支持手机号登陆");
      inquirer
        .prompt([
          {
            type: "input",
            name: "phone",
            message: "请输入手机号",
          },
          {
            type: "password",
            name: "password",
            message: "请输入密码",
          },
        ])
        .then((accountInfo) => {
          const s = ora().start("登陆中...");
          net.login_cellphone(accountInfo).then((e: any) => {
            s.succeed("登陆成功");
            writeFileSync(configPath, JSON.stringify(e.body, null, 2));
          });
        });
    }
    if (options.list) {
      const cookie = checkLogin();
      const spinner = ora("正在获取数据...").start();
      const { pageSize = 10, page = 1 } = options;

      net
        .user_cloud({
          cookie,
          limit: pageSize,
          offset: pageSize * (Number(page) - 1),
        })
        .then((e: any) => {
          spinner.succeed("获取数据成功");
          console.table(
            (e.body.data as Datum[]).map((e) => {
              const { name, alia, ar, al } = e.simpleSong;
              const arList = ar.map((e) => e.name).join(" / ");
              return {
                歌名: name,
                别名: first(alia),
                "🎙️ 演唱": arList,
                "💽 专辑": al.name,
                "📃 大小": (e.fileSize / 1024 / 1024).toFixed(0) + " MB",
                "📅 时间": dayjs(e.addTime).format("YY/MM/DD HH:mm"),
                格式: e.fileName.split(".").pop(),
              };
            })
          );
        })
        .catch((e) =>
          spinner.fail(`获取数据失败: ${JSON.stringify(e, null, 2)}`)
        );
    }
    if (options.upload) {
      const path = join(options.upload);
      const fileName = path.split("/").pop();
      const config = readFileSync(options.upload, { encoding: "binary" });

      const homeConfig = readFileSync(configPath, "utf8");
      const cookie = JSON.parse(homeConfig).cookie;
      const bf = Buffer.from(config, "binary");
      if (fileName) {
        const spinner = ora(`正在上传: ${fileName}`).start();
        net
          .cloud({ cookie, songFile: { name: fileName, data: bf } })
          .then(() => spinner.succeed("上传成功"))
          .catch((e) => spinner.fail(`上传失败: ${e.body.msg}`));
      }
    }
  });

program.parse(process.argv);

function checkLogin() {
  if (!existsSync(configPath)) {
    ora().fail("请先登陆");
    process.exit();
  } else {
    const config = readFileSync(configPath, "utf8") || "{}";
    const cookie = JSON.parse(config)?.cookie;
    if (!cookie) {
      ora().fail("cookie 丢失, 请重新登陆");
      process.exit();
    }
    return cookie;
  }
}
