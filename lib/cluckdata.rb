class CluckData
	attr_reader :id, :user_id, :user_name, :text, :post_date

	def initialize(id, user_id, user_name, text, post_date)
		@id = id
		@user_id = user_id
		@user_name = user_name
		@text = text
		@post_date = post_date
	end

	def save
		p 'Saving Cluck! '
		newCluck = Cluck.create(user_id: @user_id, user_name: @user_name, text: @text, post_date: @post_date)
		
		@id = newCluck.id.to_s
	end

	def self.get_all
		p 'Getting all the clucks'
		return Cluck.all.desc(:post_date)
	end
end