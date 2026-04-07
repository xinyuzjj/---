import streamlit as st
import json
import os

# --- 1. 基础配置 ---
st.set_page_config(
    page_title="资源站后台管理系统",
    page_icon="🛡️",
    layout="wide"
)

# 【请修改此处】设置你的管理密码
ADMIN_PASSWORD = "1234" 

# --- 2. 数据处理核心函数 ---
def load_res():
    """读取资源数据库"""
    if not os.path.exists('resources.json'): 
        return []
    with open('resources.json', 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            # 确保每个 ID 都是字符串，方便前端处理
            return data
        except:
            return []

def save_res(data):
    """保存数据并按 ID 排序"""
    # 按照 ID 数字大小进行升序排列，保持 JSON 文件整齐
    try:
        data.sort(key=lambda x: int(x['id']))
    except:
        pass
    with open('resources.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# --- 3. 登录权限控制 ---
if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = False

def check_login():
    if not st.session_state['logged_in']:
        st.title("🔒 中央门户管理后台")
        pwd = st.text_input("请输入管理员密码", type="password")
        if st.button("验证并进入"):
            if pwd == ADMIN_PASSWORD:
                st.session_state['logged_in'] = True
                st.rerun()
            else:
                st.error("密码核对失败，访问被拒绝。")
        st.stop()

check_login()

# --- 4. 管理界面头部 ---
col_title, col_logout = st.columns([5, 1])
with col_title:
    st.title("📦 资源数据库维护")
    st.caption("管理前端展示的方块资源、网盘链接及提取码")

with col_logout:
    if st.button("退出登录"):
        st.session_state['logged_in'] = False
        st.rerun()

resources = load_res()

# --- 5. 现有资源管理 (搜索/编辑/删除) ---
st.divider()
st.subheader("📋 现有资源管理")

# 快速搜索栏
search_query = st.text_input("🔍 输入编号 ID 或 标题关键字快速定位", "")

# 过滤显示逻辑
if search_query:
    display_list = [
        r for r in resources 
        if search_query.lower() in r['title'].lower() or search_query == r['id']
    ]
else:
    # 默认按 ID 倒序排列（新发布的在前）
    display_list = sorted(resources, key=lambda x: int(x['id']), reverse=True)

if not display_list:
    st.info("库中暂无匹配的资源。")
else:
    st.write(f"当前找到 {len(display_list)} 条记录")
    
    for item in display_list:
        # 每一个资源使用一个折叠面板
        with st.expander(f"【ID: {item['id']}】 📍 {item['title']}"):
            # 使用表单进行编辑
            with st.form(key=f"edit_form_{item['id']}"):
                c1, c2 = st.columns([1, 4])
                c1.text_input("资源编号", value=item['id'], disabled=True)
                new_title = c2.text_input("标题", value=item['title'])
                
                new_desc = st.text_area("描述内容", value=item.get('desc', ''))
                new_url = st.text_input("网盘链接", value=item['url'])
                new_code = st.text_input("提取码", value=item.get('code', ''))
                
                # 标签转换处理
                current_tags = ",".join(item.get('tags', []))
                new_tags_input = st.text_input("标签 (用逗号隔开)", value=current_tags)
                
                # 提交修改
                if st.form_submit_button("💾 保存更新"):
                    for i, r in enumerate(resources):
                        if r['id'] == item['id']:
                            resources[i] = {
                                "id": item['id'],
                                "title": new_title,
                                "desc": new_desc,
                                "url": new_url,
                                "code": new_code,
                                "tags": [t.strip() for t in new_tags_input.replace('，', ',').split(',') if t.strip()]
                            }
                            break
                    save_res(resources)
                    st.success(f"ID {item['id']} 已同步更新")
                    st.rerun()

            # 删除按钮（放在表单外以防冲突）
            if st.button(f"🗑️ 彻底删除 ID:{item['id']}", key=f"del_btn_{item['id']}"):
                resources = [r for r in resources if r['id'] != item['id']]
                save_res(resources)
                st.warning(f"资源 {item['id']} 已移除")
                st.rerun()

# --- 6. 添加新资源 ---
st.divider()
st.subheader("➕ 添加新方块资源")

# 计算下一个可用 ID
all_ids = [int(r['id']) for r in resources]
next_id_val = max(all_ids) + 1 if all_ids else 1
next_id_str = str(next_id_val)

with st.form("add_new_resource_form"):
    ca, cb = st.columns([1, 4])
    ca.text_input("分配编号", value=next_id_str, disabled=True)
    add_title = cb.text_input("资源标题 *")
    
    add_desc = st.text_area("资源描述 (建议 30 字以内以适配方块高度)")
    add_url = st.text_input("网盘/下载链接 *")
    add_code = st.text_input("提取码 (留空则不显示)")
    add_tags = st.text_input("标签 (例如: AI, 教程, 工具)")
    
    # 显式添加提交按钮，修复 "Missing Submit Button" 错误
    submitted = st.form_submit_button("🚀 发布资源")
    
    if submitted:
        if add_title and add_url:
            new_data = {
                "id": next_id_str,
                "title": add_title,
                "desc": add_desc,
                "url": add_url,
                "code": add_code,
                "tags": [t.strip() for t in add_tags.replace('，', ',').split(',') if t.strip()]
            }
            resources.append(new_data)
            save_res(resources)
            st.success(f"成功！资源已加入库，编号为 {next_id_str}")
            st.rerun()
        else:
            st.error("请完整填写标题和链接！")

# --- 7. 页脚状态 ---
st.sidebar.markdown("---")
st.sidebar.write(f"📊 当前数据库内共有 **{len(resources)}** 个资源")
st.sidebar.info("建议定期备份 resources.json 文件以防数据丢失。")