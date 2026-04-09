import { useState } from 'react'
import './TeamPanel.css'
import { X, Users } from 'lucide-react'

const PERMISSIONS = ['爆款复刻', '混剪管理', '素材生成', '资产管理', '知识库管理', '技能管理', '团队管理']

const MOCK_MEMBERS = [
  { id: 1, name: '张三', phone: '15927002756', dept: '蛋莱智', role: '测试工程师', perms: ['爆款复刻', '混剪管理', '素材生成', '知识库管理', '技能管理', '团队管理'], disabled: false },
  { id: 2, name: '张三', phone: '15927002756', dept: '蛋莱智 / 直播运营 / 切片运营组', role: '开发工程师', perms: ['爆款复刻', '混剪管理', '素材生成', '知识库管理', '技能管理', '团队管理'], disabled: true },
]

const MOCK_LOGS = [
  { id: 1, time: '2023-05-06 12:00:00', operator: '张三 15927002756', module: '登录', type: '登录', desc: '验证码登录', result: '成功' },
  { id: 2, time: '2023-05-06 12:00:00', operator: '张三 15927002756', module: '访问控制', type: '修改', desc: '删除生成记录，ID-33', result: '成功' },
  { id: 3, time: '2023-05-06 12:00:00', operator: '战三 15927000556', module: '访问控制', type: '修改', desc: '修改PROMT提示词', result: '成功' },
  { id: 4, time: '2023-05-06 12:00:00', operator: '张三 15927002756', module: '访问控制', type: '修改', desc: '禁用15927002756权限', result: '成功' },
]

const DEPT_TREE = {
  name: '蛋莱智',
  children: [
    {
      name: '直播运营BU',
      children: [
        { name: '私信运营', children: [], members: [{ name: '张三', role: '直播负责人' }, { name: '张三', role: '直播负责人' }, { name: '张三', role: '直播负责人' }] },
        { name: '直播运营', children: [], members: [{ name: '张三', role: '直播负责人' }] },
      ],
      members: [{ name: '张三', role: '直播负责人' }],
    },
  ],
  members: [],
}

function DeptPicker({ onConfirm, onCancel }) {
  const [path, setPath] = useState([DEPT_TREE])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const current = path[path.length - 1]

  const handleDrillDown = (child) => setPath(prev => [...prev, child])

  const allItems = [
    ...current.children.map(c => ({ ...c, isGroup: true })),
    ...(current.members || []).map(m => ({ ...m, isGroup: false })),
  ].filter(item => !search || item.name.includes(search))

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="picker-modal" onClick={e => e.stopPropagation()}>
        <div className="picker-header">
          选择成员
          <button className="picker-close" onClick={onCancel}><X size={16}/></button>
        </div>
        <div className="picker-body">
          <div className="picker-left">
            <input className="picker-search" placeholder="搜索成员" value={search} onChange={e => setSearch(e.target.value)}/>
            <div className="picker-breadcrumb">
              {path.map((p, i) => (
                <span key={i}>
                  {i > 0 && ' > '}
                  <span className={i === path.length - 1 ? 'crumb-active' : 'crumb-link'} onClick={() => i < path.length - 1 && setPath(prev => prev.slice(0, i + 1))}>
                    {p.name}
                  </span>
                </span>
              ))}
            </div>
            {path.length > 1 && (
              <button className="picker-back" onClick={() => setPath(prev => prev.slice(0, -1))}>← 返回上一级部门</button>
            )}
            <div className="picker-list">
              {allItems.map((item, i) => (
                item.isGroup ? (
                  <div key={i} className="picker-group-item" onClick={() => handleDrillDown(item)}>
                    <span className="picker-avatar"><Users size={14} strokeWidth={1.5}/></span>
                    <span>{item.name}</span>
                    <span className="picker-drill">下级</span>
                  </div>
                ) : (
                  <label key={i} className="picker-member-item">
                    <input type="radio" name="member" checked={selected?.name === item.name && selected?.role === item.role} onChange={() => setSelected(item)}/>
                    <span className="picker-avatar picker-avatar-letter">{item.name.charAt(0)}</span>
                    <div>
                      <div className="picker-name">{item.name}</div>
                      <div className="picker-role">{item.role}</div>
                    </div>
                  </label>
                )
              ))}
            </div>
          </div>
          <div className="picker-right">
            <div className="picker-selected-title">已选择({selected ? 1 : 0})</div>
            {selected && (
              <div className="picker-selected-item">
                <span className="picker-avatar picker-avatar-letter">{selected.name.charAt(0)}</span>
                <span>{selected.name}</span>
                <button onClick={() => setSelected(null)}><X size={12}/></button>
              </div>
            )}
          </div>
        </div>
        <div className="picker-footer">
          <button className="btn-cancel" onClick={onCancel}>取消</button>
          <button className="btn-confirm" onClick={() => selected && onConfirm(selected)} disabled={!selected}>确定</button>
        </div>
      </div>
    </div>
  )
}

function AddMemberModal({ onConfirm, onCancel }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [perms, setPerms] = useState([])
  const [showPicker, setShowPicker] = useState(false)

  const togglePerm = (p) => setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  const toggleAll = () => setPerms(perms.length === PERMISSIONS.length ? [] : [...PERMISSIONS])

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}>
        <div className="add-member-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            添加成员
            <button className="picker-close" onClick={onCancel}><X size={16}/></button>
          </div>
          <div className="modal-body">
            <div className="modal-field">
              <label>选择用户</label>
              <button className="user-select-btn" onClick={() => setShowPicker(true)}>
                {selectedUser ? (
                  <span className="selected-user"><span className="picker-avatar picker-avatar-letter">{selectedUser.name.charAt(0)}</span>{selectedUser.name} {selectedUser.phone || ''}</span>
                ) : '请选择团队成员'}
              </button>
            </div>
            <div className="modal-field">
              <label>用户权限</label>
              <div className="perm-grid">
                <label className="perm-item">
                  <input type="checkbox" checked={perms.length === PERMISSIONS.length} onChange={toggleAll}/> 全部
                </label>
                {PERMISSIONS.map(p => (
                  <label key={p} className="perm-item">
                    <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)}/> {p}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onCancel}>取消</button>
            <button className="btn-confirm" onClick={() => onConfirm({ user: selectedUser, perms })} disabled={!selectedUser}>确认</button>
          </div>
        </div>
      </div>
      {showPicker && (
        <DeptPicker
          onConfirm={(user) => { setSelectedUser(user); setShowPicker(false) }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </>
  )
}

function MemberList({ members, setMembers }) {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editMember, setEditMember] = useState(null)

  const filtered = members.filter(m => {
    if (search && !m.name.includes(search) && !m.phone.includes(search)) return false
    if (deptFilter && !m.dept.includes(deptFilter)) return false
    return true
  })

  const handleAdd = ({ user, perms }) => {
    setMembers(prev => [...prev, {
      id: Date.now(), name: user.name, phone: '15927002756',
      dept: '蛋莱智', role: user.role || '成员', perms, disabled: false
    }])
    setShowAdd(false)
  }

  const handleToggleDisable = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, disabled: !m.disabled } : m))
  }

  return (
    <div className="team-content">
      <div className="team-toolbar">
        <input className="team-search-input" placeholder="请输入账户名称或手机号" value={search} onChange={e => setSearch(e.target.value)}/>
        <input className="team-search-input" placeholder="请选择部门" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}/>
        <button className="btn-query">查询</button>
        <button className="btn-add-member" onClick={() => setShowAdd(true)}>添加成员</button>
      </div>
      <table className="team-table">
        <thead>
          <tr>
            <th>成员</th><th>部门</th><th>职务</th><th>功能权限</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id}>
              <td>
                <div className="member-cell">
                  <span className="member-avatar member-avatar-letter">{m.name.charAt(0)}</span>
                  <div>
                    <div className="member-name">
                      {m.name}
                      {m.disabled && <span className="member-tag disabled">已禁用</span>}
                    </div>
                    <div className="member-phone">{m.phone}</div>
                  </div>
                </div>
              </td>
              <td>{m.dept}</td>
              <td>{m.role}</td>
              <td className="perm-cell">
                <div className="perm-tags">
                  {m.perms.map(p => <span key={p} className="perm-tag">{p}</span>)}
                </div>
              </td>
              <td>
                <div className="member-actions">
                  <button className="btn-edit-perm" onClick={() => setEditMember(m)}>修改权限</button>
                  <button className={`btn-disable ${m.disabled ? 'btn-enable' : ''}`} onClick={() => handleToggleDisable(m.id)}>
                    {m.disabled ? '启用' : '禁用'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && <AddMemberModal onConfirm={handleAdd} onCancel={() => setShowAdd(false)}/>}
      {editMember && (
        <EditPermModal
          member={editMember}
          onConfirm={(perms) => {
            setMembers(prev => prev.map(m => m.id === editMember.id ? { ...m, perms } : m))
            setEditMember(null)
          }}
          onCancel={() => setEditMember(null)}
        />
      )}
    </div>
  )
}

function EditPermModal({ member, onConfirm, onCancel }) {
  const [perms, setPerms] = useState([...member.perms])
  const togglePerm = (p) => setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  const toggleAll = () => setPerms(perms.length === PERMISSIONS.length ? [] : [...PERMISSIONS])

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="add-member-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          修改权限
          <button className="picker-close" onClick={onCancel}><X size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label>选择用户</label>
            <div className="selected-user-display">
              <span className="picker-avatar picker-avatar-letter">{member.name.charAt(0)}</span> {member.name} {member.phone}
            </div>
          </div>
          <div className="modal-field">
            <label>用户权限</label>
            <div className="perm-grid">
              <label className="perm-item">
                <input type="checkbox" checked={perms.length === PERMISSIONS.length} onChange={toggleAll}/> 全部
              </label>
              {PERMISSIONS.map(p => (
                <label key={p} className="perm-item">
                  <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)}/> {p}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>取消</button>
          <button className="btn-confirm" onClick={() => onConfirm(perms)}>确认</button>
        </div>
      </div>
    </div>
  )
}

function OperationLog() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')

  const filtered = MOCK_LOGS.filter(l => {
    if (search && !l.operator.includes(search)) return false
    if (typeFilter && l.type !== typeFilter) return false
    if (resultFilter && l.result !== resultFilter) return false
    return true
  })

  return (
    <div className="team-content">
      <div className="team-toolbar">
        <input className="team-search-input" placeholder="请输入操作者名称或手机号" value={search} onChange={e => setSearch(e.target.value)}/>
        <select className="team-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">请选择操作类型</option>
          <option value="登录">登录</option>
          <option value="修改">修改</option>
          <option value="删除">删除</option>
        </select>
        <select className="team-select" value={resultFilter} onChange={e => setResultFilter(e.target.value)}>
          <option value="">请选择操作结果</option>
          <option value="成功">成功</option>
          <option value="失败">失败</option>
        </select>
        <button className="btn-query">查询</button>
      </div>
      <table className="team-table">
        <thead>
          <tr>
            <th>操作时间</th><th>操作者</th><th>操作模块</th><th>操作类型</th><th>操作描述</th><th>操作结果</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.id}>
              <td>{l.time}</td>
              <td>{l.operator}</td>
              <td>{l.module}</td>
              <td>{l.type}</td>
              <td>{l.desc}</td>
              <td><span className={`log-result ${l.result === '成功' ? 'success' : 'fail'}`}>{l.result}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TeamPanel() {
  const [tab, setTab] = useState('members')
  const [members, setMembers] = useState(MOCK_MEMBERS)

  return (
    <div className="team-panel">
      <div className="team-tabs">
        <button className={`team-tab ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>团队成员</button>
        <button className={`team-tab ${tab === 'logs' ? 'active' : ''}`} onClick={() => setTab('logs')}>操作日志</button>
      </div>
      {tab === 'members' ? <MemberList members={members} setMembers={setMembers}/> : <OperationLog/>}
    </div>
  )
}
